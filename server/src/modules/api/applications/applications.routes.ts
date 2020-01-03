import { Request, Response } from 'express';
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

import { UsersRoutes } from "../users/users.routes";
import { returnHandler } from '../../common/return-handlers';

import { AppCache } from "../../common/cache";
import { appDB } from './applications.db';
import { userDB }  from '../users/users.db';

export class ApplicationsRoutes {

  /**
   * Retourne tous les applications.
   */
  public static async all(req: Request, res: Response) {
    let applications = [];
    try {
      const items = await appDB.find();
      applications = req.params.type ? items.filter((item: any) => item.group.toLowerCase() === req.params.type) : items;
      const total = applications.length;
      return res.status(200).json( returnHandler( { items: applications, total } ) );
    }
    catch(e) {
      return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la recherche des applications", e) );
    }
  }

  /**
   * Retourne une application par son ID.
   */
  public static async get(req: Request, res: Response) {
    try {
      const application = await appDB.findOne({_id: req.params.id}, {name: 1, url: 1});
      const applicationToView = application.toObject();

      // Get all users attached to this application.
      const users = await userDB.find({applications: req.params.id});
      applicationToView.users = users;

      return res.status(200).json( returnHandler( applicationToView ) );
    }
    catch(e) {
      return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la récupération d'un application", e) );
    }
  }

  // Create application route.
  public static async create(req: Request, res: Response) {
    const allowedValues = ['name', 'url'];
    const application = _.pick(req.body, allowedValues);

    // Crée l'application
    try {
      // Récupère l'utilisateur courant et l'attribue à la création de la charge.
      const currentUser = await UsersRoutes.findUserBySub(req);
      application.user = currentUser['_id'];

      // Insère la nouvelle application dans la base de données
      const appSaved = await appDB.create(application);

      // Affecte à chaque utilisateur les droits pour l'application.
      for (const u of req.body.users) {
        const user = await userDB.findOne({_id: u._id});
        if (user.applications) {
          if (user.application.includes(ObjectID(appSaved._id))) {
            user.applications = [...user.applications, appSaved._id];
          }
        } else {
          user.applications = [appSaved._id];
        }
      }

      return res.status(200).json( returnHandler(appSaved, "L'application a été créée") );
    }
    catch(err) {
      return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la création de l'application", err));
    }
  }

  /**
   * Met à jour l'application existant.
   */
  public static async update(req: Request, res: Response) {
    const allowedValues = ['name', 'url'];
    let application = _.pick(req.body, allowedValues);

    // Vérifie si l'application a un identifiant en entrée.
    if (req.body._id) {
      const id = req.body._id;

      // Vérifie la validité de l'ID.
      if (!ObjectID.isValid(id)) {
        return res.status(400).json( returnHandler(null, "L'identifiant entré est incorrect", true) );
      }

      try {
        const appToSave = await appDB.findById(id);
        if (!appToSave) {
          return res.status(404).json( returnHandler(null, "L'application ne peut pas être mise à jour, car il est introuvable", true) );
        }

        // Assigne toutes les valeurs en entrée à l'objet Application.
        Object.keys(application).forEach((key) => {
          if (application[key]) {
            appToSave[key] = application[key];
          }
        });

        // Retire toutes les autres valeurs qui n'ont pas été entrée (à part les valeurs systèmes).
        Object.keys(appToSave.toObject()).forEach((key) => {
          if ((!application.hasOwnProperty(key) || !application[key]) && key != '_id' && _.includes(allowedValues, key)) {
            appToSave[key] = undefined;
          }
        });

        // Met à jour la date de mise à jour et modifie l'application dans la base de données.
        appToSave.updated = new Date();
        const appSaved = await appDB.findOneAndUpdate({_id: id}, appToSave, {new: true});

        // Retire l'application aux utilisateurs qui ne sont plus sélectionnés.
        const users = await userDB.find({applications: appToSave._id});
        for (const u of users) {
          await ApplicationsRoutes.removeApplication(u, req.body.users, appToSave._id.toString());
        }

        // Ajoute une application à un utilisateur s'il ne l'a pas déjà.
        for (const u of req.body.users) {
          await ApplicationsRoutes.addApplication(u._id, appSaved._id.toString());
        }

        return res.status(200).json( returnHandler(appSaved, "L'application a été mise à jour") );
      }
      catch(err) {
        return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la création de l'application", err));
      }
    }
    else {
      return res.status(400).json( returnHandler(null, "Aucune application valide ne figure dans la requête", true) );
    }
  }

  /**
   * Supprime l'application.
   */
  public static async remove(req: Request, res: Response) {
    const id = req.params.id;

    // Vérifie la validité de l'ID.
    if (!ObjectID.isValid(id)) {
      return res.status(400).json( returnHandler(null, "L'identifiant entré est incorrect", true) );
    }

    try {
      const application = await appDB.findOne({_id: id});

      // Vérifie la validité de l'ID.
      if (!application) {
        return res.status(400).json( returnHandler(null, "L'application n'a pas été trouvée", true) );
      }

      // Supprime l'application par son ID.
      await appDB.findOneAndDelete({_id: application._id});

      // Retire l'application aux utilisateurs de l'application supprimée.
      const users = await userDB.find({applications: req.params.id});
      for (const u of users) {
        u.applications = u.applications.filter((app: any) => app.toString() !== req.params.id)
        await userDB.findOneAndUpdate({_id: u._id}, u);
      }

      return res.status(200).json( returnHandler(null, "L'application a été supprimée") );
    }
    catch(err) {
      return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la suppression de l'application", err) );
    }
  }

  /**
   * Connecte à l'application sélectionnée.
   */
  public static async connect(req: Request, res: Response) {
    try {
      // Check if the user exists.
      const currentUser = await UsersRoutes.findUserBySub(req);
      if (currentUser) {

        // Check if user is active.
        if (currentUser.active) {

          // Set App ID to Redis.
          const application = await appDB.findOne({_id: req.params.appID});
          AppCache.setAppURL(req['user'].sub, application.url);

          return res.json( returnHandler( { user: currentUser } ) );
        } else {
          return res.status(401).json( returnHandler(null, "Votre compte n'est pas actif pour le moment.") );
        }
      }
    }
    catch(err) {
      return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la suppression de l'application", err) );
    }
  }

  /**
   * Retire une applications aux utilisateurs sélectionnés
   */
  public static async removeApplication(user: any, appUsers: any[], appID: string) {
    if (appUsers.filter((user: any) => user.toString() === user._id).length === 0) {
      user.applications = user.applications.filter((app: any) => app.toString() !== appID)
      await userDB.findOneAndUpdate({_id: user._id}, user);
    }
  }

  /**
   * Ajoute une applications aux utilisateurs sélectionnés
   */
  public static async addApplication(userID: string, applicationID: string) {
    const user = await userDB.findOne({_id: userID});
    if (user.applications.length > 0) {
      if (user.applications.filter((app: any) => app.toString() === applicationID).length === 0) {
        user.applications = [...user.applications, applicationID];
        await userDB.findOneAndUpdate({_id: user._id}, user);
      }
    } else {
      user.applications = [applicationID];
      await userDB.findOneAndUpdate({_id: user._id}, user);
    }
  }

}
