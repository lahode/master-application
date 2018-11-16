import { Request, Response } from 'express';

import { CONFIG } from "../../../config";
import { AuthRoutes } from "../auth/auth.routes";
import { PasswordStrategy } from "../../security/password-strategy";
import { returnHandler } from '../../common/return-handlers';

const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);

import { AuthStrategyToken } from "../../security/authentication-token-strategy";

export class UsersRoutes {

  // Get user by IDs.
  public static async getUsersByID(ids) {
    let results = [];
    try {
      for (let id of ids) {
        // Get each user in the database.
        const user = await userDB.findOne({ _id: id });
        if (!user) {
          return {error: 404, message: "Aucun utilisateur n'a été trouvé.", success: false};
        }
        if (user.hasOwnProperty('data')) {
          results.push(user.data);
        }
      }
    }
    catch(e) {
      return {error: 500, message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false};
    }
    return results;
  }

  // Fetch the user by sub.
  public static async findUserBySub(userInfo) {
    if (userInfo) {
      try {
        // Find the user by sub (token) info.
        const user = await userDB.findOne({sub: userInfo.sub});
        if (user) {
          delete(user.password);
          return {user: user, success:true};
        } else {
          return {error: 404, message: "Aucun utilisateur n'a été trouvé.", success: false};
        }
      }
      catch (e) {
        return {error: 500, message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false};
      }
    }
    else {
      return {error: 404, message: "Aucun utilisateur n'a été trouvé.", success: false};
    }
  }

  // Get user by ID route.
  public static async get(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    // Find a user by it's ID.
    try {
      const user = await userDB.findOne({ _id: req.params.id });
      user.password = '';
      return res.json( returnHandler( {user: user} ) );
    }
    catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération de l'utilisateur.", e) );
    }
  }

  // Get all users route
  public static async list(req: Request, res: Response) {
    try {
      // Détermine l'ordre des résultats
      let sort: any = {lastname: 1};
      if (req.params.sort) {
        sort = req.params.sort.charAt(0) === '-' ? { [req.params.sort.substr(1)] : -1} : { [req.params.sort] : 1 };
      }

      let search = {};
      if (req.params.field) {
        search[req.params.field] = new RegExp(req.params.value, "i");
      }

      const limit = (parseInt(req.params.limit) - parseInt(req.params.offset) > 0) ? parseInt(req.params.limit) - parseInt(req.params.offset) : 0;
      const query = search;

      // Find all users in the database.
      const items = await userDB.find(query, {username: 1, email: 1, active: 1})
                                .sort(sort)
                                .skip(parseInt(req.params.offset) || 0)
                                .limit(limit || 50);

      // Return the number of results.
      const count = await userDB.find(query, { lastname: 1 });
      const total = count.length;
      return res.status(200).json( returnHandler( { items, total } ) );
    }
    catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération des utilisateurs.", e) );
    }
  }

  // Create user route.
  public static async create(req: Request, res: Response) {
    if (!req.body.username) {
      return res.status(400).json( returnHandler(null, "Un utilisateur doit avoir au moins un nom d'utilisateur.") );
    }
    let user = Object.assign({}, req.body);

    // Check if ID exists
    if (!user._id) {
      // Set the user owner.
      if (typeof user.owner !== 'string') {
        user.owner = user.owner._id;
      }
      user.created = new Date().toISOString();
      user.updated = new Date().toISOString();
      user.active = true;
      try {
        // Create the user in the database.
        const userInserted = await userDB.insert(user);
        return res.json( returnHandler( {user: userInserted} ) );
      }
      catch(e) {
        return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de l'insertion de l'utilisateur", e) );
      }
    }
    else {
      return res.status(500).json( returnHandler(null, "Impossible d'insérer cet utilisateur, l'utilisateur existe déjà.") );
    }
  }

  // Update user route.
  public static async update(req: Request, res: Response) {
    let user = Object.assign({}, req.body);

    // Manage the update
    if (user._id) {
      if (user.owner) {
        if (typeof user.owner !== 'string') {
          user.owner = user.owner._id;
        }
      } else {
        user.owner = user._id;
      }
      user.updated = new Date().toISOString();

      try {
        const checkUser = await userDB.findOne({ _id: user._id });
        if (checkUser) {

          // Manage password or username modifications.
          user.password = checkUser.password;
          if (user.passwordcurrent) {
            const passwordcurrent = user.passwordcurrent;
            const passwordnew = user.passwordnew || null;

            // Check if password authentification is ok.
            const checkPassword = await AuthStrategyToken.login(passwordcurrent, user, res);
            if (passwordnew) {

              // Check if new password is valid.
              const errorValidatePassword = AuthRoutes.checkPasswordStrategy(passwordnew);
              if (errorValidatePassword) {
                return res.status(400).json( returnHandler(null, errorValidatePassword) );
              }

              // Get an encrypted password and set the new token name.
              const passwordDigest = await PasswordStrategy.getPasswordDigest(passwordnew);
              user.password = passwordDigest;
            }
          } else {
            if (user.username != checkUser.username || user.passwordnew) {
              return res.status(400).json( returnHandler(null, "Le mot de passe actuel est obligatoire pour modifier le nom d'utilisateur ou mot de passe") );
            }
            user.username = checkUser.username;
          }
          delete(user.passwordcurrent);
          delete(user.passwordnew);

          // Update user in the database.
          const updatedUser = await userDB.update({ _id: user._id }, user);
          return res.json( returnHandler( { user } ) );
        } else {
          return res.status(404).json( returnHandler(null, "Impossible de modifier cet utilisateur, aucun utilisateur n'a été trouvé.") );
        }
      }
      catch(e) {
        if (e.status === 403) {
          return res.status(403).json( returnHandler(null, "Mot de passe invalide.", e) );
        }
        return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la mise à jour de l'utilisateur.", e) );
      }
    } else {
      return res.status(500).json( returnHandler(null, "Impossible de modifier cet utilisateur, l'utilisateur n'a pas d'identifiant.") );
    }

  }

  // Delete user route.
  public static async remove(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    try {
      // Check if the user exists.
      const checkUser = await userDB.findOne({ _id: req.params.id });
      if (checkUser) {

        //Delete the user in the database.
        const userDeleted = await userDB.remove({ _id: req.params.id });
        return res.json(returnHandler( {deleted: req.params.id} ) );
      } else {
        return res.status(404).json( returnHandler(null, "Impossible de supprimer cet utilisateur, aucun utilisateur n'a été trouvé.") );
      }
    } catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la suppression de l'utilisateur.", e) );
    }
  }

}
