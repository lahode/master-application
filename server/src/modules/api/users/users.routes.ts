import { Request, Response } from 'express';
import * as moment from 'moment';
import { ObjectID } from 'mongodb';

import { CONFIG } from "../../../config";
import { Mailer } from '../../common/mailer';
import { AuthRoutes } from "../auth/auth.routes";
import { PasswordStrategy } from "../../security/password-strategy";
import { ImageProcessing } from "../files/images-processing";
import { FilesRoutes } from '../files/files.routes';
import { returnHandler } from '../../common/return-handlers';

import { userDB, DEFAULT_ICON } from './users.db';
import { fileDB } from '../files/files.db';

import { AuthStrategyToken } from "../../security/authentication-token-strategy";

const NBDAYS_EXPIRE_RENEW_TOKEN = 7;

export class UsersRoutes {

  // Fetch the user by sub.
  public static async findUserBySub(userInfo: any) {
    if (userInfo) {
      try {
        // Find the user by sub (token) info.
        const user = await userDB.findOne({sub: userInfo.sub}, {sub: 1, username: 1, firstname: 1, lastname: 1, email: 1, roles: 1, icon: 1, picture: 1, active: 1, language: 1, emailNotify: 1, description: 1})
                                 .populate('roles.role', 'permissions');

        // Return the user.
        if (user) {
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

  // Find a user by it's sub token.
  public static async getCurrent(req: Request, res: Response) {
    try {
      // Find the user by sub (token) info.
      const user = await this.findUserBySub(req['user']);

      // Return the user.
      if (user) {
        return res.json( returnHandler( {user: user} ) );
      } else {
        return res.status(404).json( returnHandler(null, "Aucun utilisateur n'a été trouvé.") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération de l'utilisateur.", e) );
    }
  }

  /**
   * Retourne tous les utilisateurs.
   */
  public static async getLike(req: Request, res: Response) {
    try {
      const users = await userDB.find({ $and: [{active: true}, {$or:[ {firstname: new RegExp(req.params.search, "i")}, {lastname: new RegExp(req.params.search, "i")} ] } ] },
                                        { firstname: 1, lastname: 1 })
                                  .limit(5)
                                  .sort('lastname');
      return res.status(200).json( returnHandler( users ) );
    }
    catch(e) {
      return res.status(400).json( returnHandler(null, "Une erreur est survenue lors de la recherche sur les utilisateurs", e) );
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

  // Get profile route.
  public static async getProfile(req: Request, res: Response) {
    try {
      const data = await UsersRoutes.findUserBySub(req['user']);
      return res.json( returnHandler( {user: data.user} ) );
    }
    catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération de l'utilisateur.", e) );
    }
  }

  // Get all users route.
  public static async all(req: Request, res: Response) {
    try {
      // Find all active users in the database.
      const users = await userDB.find({active:1}, {username: 1, firstname: 1, lastname: 1}).sort('username')
      return res.status(200).json( returnHandler( users ) );
    }
    catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération des utilisateurs.", e) );
    }
  }

  // List users route.
  public static async list(req: Request, res: Response) {
    try {
      // Détermine l'ordre des résultats
      let sort: any = {lastname: 1};
      if (req.params.sort) {
        sort = req.params.sort.charAt(0) === '-' ? { [req.params.sort.substr(1)] : -1} : { [req.params.sort] : 1 };
      }

      let search = {};
      if (req.params.field) {
        if (req.params.field === 'active') {
          search[req.params.field] = req.params.value === 'true' ? true : false;
        } else {
          search[req.params.field] = new RegExp(req.params.value, "i");
        }
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
      try {
        // Set the user owner.
        const data = await UsersRoutes.findUserBySub(req['user']);
        user.owner = data.user._id;

        // Create the user in the database.
        const userInserted = await userDB.create(user);
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
    try {
      let body = Object.assign({}, req.body);
      const user = await UsersRoutes.updateUser(body, res, true);
      return res.json( returnHandler( { user } ) );
    }
    catch(e) {
      return res.status(e.status).json( returnHandler(null, e.message, e.error) );
    }
  }

  // Update user route.
  public static async updateProfile(req: Request, res: Response) {
    try {
      let body = Object.assign({}, req.body);

      const data = await UsersRoutes.findUserBySub(req['user']);
      if (data.user._id.toString() !== body._id) {
        return res.status(403).json( returnHandler(null, "Impossible de mettre à jour, cet utilisateur ne correspond pas à votre profil.") );
      }

      const user = await UsersRoutes.updateUser(body, res);
      return res.json( returnHandler( { user } ) );
    }
    catch(e) {
      return res.status(e.status).json( returnHandler(null, e.message, e.error) );
    }
  }

  // Update the user.
  public static async updateUser(user, res: Response, admin = false) {
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
            await AuthStrategyToken.login(passwordcurrent, user, res);
            if (passwordnew) {

              // Check if new password is valid.
              const errorValidatePassword = AuthRoutes.checkPasswordStrategy(passwordnew);
              if (errorValidatePassword) {
                throw({status: 400, message: errorValidatePassword, error: null});
              }

              // Get an encrypted password and set the new token name.
              const passwordDigest = await PasswordStrategy.getPasswordDigest(passwordnew);
              user.password = passwordDigest;
            }
          } else if (!admin) {
            if (user.username != checkUser.username || user.passwordnew) {
              throw({status: 400, message: "Le mot de passe actuel est obligatoire pour modifier le nom d'utilisateur ou mot de passe.", error: null});
            }
            user.username = checkUser.username;
          }
          delete(user.passwordcurrent);
          delete(user.passwordnew);

          // Update profile icon if changed.
          if ((checkUser.picture && user.picture !== checkUser.picture.toString()) ||
              (user.picture && !checkUser.picture)) {

            // Delete the previous picture.
            if (checkUser.picture) {
              await FilesRoutes.removeFiles({ _id: checkUser.picture });
              user.icon = DEFAULT_ICON;
            }

            // Add the new picture.
            if (user.picture) {

              // Create a user icon (width: 32, height: 32)
              const imageFile = await fileDB.findOne({ _id: user.picture });

              if (imageFile) {
                const root = require('app-root-path').path;
                const imageResult = await ImageProcessing.scaleAndCrop(`${root}/${imageFile.path}`, null, 32, 32);
                if (imageResult.success) {
                  // Add the user icon to the user.
                  user.icon = `data:${imageFile.mimetype};base64,${imageResult.data}`;

                  // Set the image file as permanent.
                  imageFile.updated = new Date();
                  imageFile.active = true;
                  await fileDB.findByIdAndUpdate(imageFile._id, imageFile);
                }
              }
            }
          }

          // Update user in the database.
          await userDB.update({ _id: user._id }, user);
          return user;
        } else {
          throw({status: 404, message: "Impossible de modifier cet utilisateur, aucun utilisateur n'a été trouvé.", error: null});
        }
      }
      catch(e) {
        if (e.status === 403) {
          throw({status: 403, message: "Mot de passe invalide.", error: e})
        } else if (e.message && e.status) {
          throw({status: e.status, message: e.message, error: e})
        }
        throw({status: 500, message: "Une erreur s'est produite lors de la mise à jour de l'utilisateur.", error: e});
      }
    } else {
      throw({status: 500, message: "Impossible de modifier cet utilisateur, l'utilisateur n'a pas d'identifiant.", error: null});
    }

  }

  // Delete user route.
  public static async remove(req: Request, res: Response) {
    // Check if an user ID has been given.
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    try {
      // Check if the user exists.
      const checkUser = await userDB.findOne({ _id: req.params.id });
      if (checkUser) {

        // Supprime tous les fichier attachés à la charge.
        if (checkUser.picture) {
          await FilesRoutes.removeFiles({ _id: checkUser.picture });
        }

        //Delete the user in the database.
        await userDB.deleteOne({ _id: ObjectID(req.params.id) });
        return res.json(returnHandler( {deleted: req.params.id} ) );

      } else {
        return res.status(404).json( returnHandler(null, "Impossible de supprimer cet utilisateur, aucun utilisateur n'a été trouvé.") );
      }
    } catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la suppression de l'utilisateur.", e) );
    }
  }

  // Send a token to create an authentication for the selected user.
  public static async resetAuth(req: Request, res: Response) {
    // Check if an user ID has been given.
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    try {
      // Find the user in the database.
      const user = await userDB.findOne({ _id: req.params.id });
      if (user) {
        // Create a new token and attach it to the message.
        const maxtime = NBDAYS_EXPIRE_RENEW_TOKEN * 24 * 60 * 60; // 24 hours
        user.sub = 'reset' + '|' + Date.now();
        const newToken = await AuthStrategyToken.signup(user, maxtime);

        // Set End date for e-mail.
        const endDateTimestamp = (new Date().getTime() / 1000) + maxtime;
        const formattedEndDate = moment.unix(endDateTimestamp).format("DD.MM.YYYY")

        // Update user with new token.
        await userDB.update({ _id: user._id }, user);

        // Send the e-mail.
        const sentMail = await Mailer.sendMail(`Authentification à la plateforme: ${CONFIG.APPNAME}`, user.email, `<p>Veuillez cliquer sur ce lien pour <a href="${CONFIG.FRONTEND}?connect=${newToken.token}">vous y connecter.</a></p><p>Attention, ce lien doit être utilisé avant le ${formattedEndDate}.</p>`);
        return res.json( returnHandler( { mailID: sentMail['mailID'] } ) );
      } else {
        return res.status(401).json( returnHandler(null, "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la récupération de l'utilisateur", e) );
    }
  }

}
