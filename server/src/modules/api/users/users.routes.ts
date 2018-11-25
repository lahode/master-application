import { Request, Response } from 'express';

import { CONFIG } from "../../../config";
import { AuthRoutes } from "../auth/auth.routes";
import { PasswordStrategy } from "../../security/password-strategy";
import { ImageProcessing } from "../files/images-processing";
import { returnHandler } from '../../common/return-handlers';

const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);
const roleDB = new Datastore(CONFIG.DATABASE.ROLES);
const fileDB = new Datastore(CONFIG.DATABASE.FILES);

const defaultImageProfile = 'data:image/png;base64,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';

import { AuthStrategyToken } from "../../security/authentication-token-strategy";

export class UsersRoutes {

  // Fetch the user by sub.
  public static async findUserBySub(userInfo) {
    if (userInfo) {
      try {
        // Find the user by sub (token) info.
        const user = await userDB.findOne({sub: userInfo.sub}, {sub: 1, username: 1, firstname: 1, lastname: 1, email: 1, roles: 1, icon: 1, picture: 1});

        // Add permissions to user's roles
        let index = 0;
        for (let userRole of user.roles) {
          const roleID = userRole.role;
          const role = await roleDB.findOne({_id: roleID});
          user.roles[index].role = {
            _id: roleID,
            permissions: role.permissions
          };
          index++;
        }

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
      try {
        // Set the user owner.
        // const data = await UsersRoutes.findUserBySub(req['user']);
        // user.owner = data.user._id;

        // Set Default Image Profile.
        user.icon = defaultImageProfile;

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
    try {
      let body = Object.assign({}, req.body);
      const user = await UsersRoutes.updateUser(body, res);
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
  public static async updateUser(user, res: Response) {
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
                throw({status: 400, message: errorValidatePassword, error: null});
              }

              // Get an encrypted password and set the new token name.
              const passwordDigest = await PasswordStrategy.getPasswordDigest(passwordnew);
              user.password = passwordDigest;
            }
          } else {
            if (user.username != checkUser.username || user.passwordnew) {
              throw({status: 400, message: "Le mot de passe actuel est obligatoire pour modifier le nom d'utilisateur ou mot de passe.", error: null});
            }
            user.username = checkUser.username;
          }
          delete(user.passwordcurrent);
          delete(user.passwordnew);

          // Update profile icon if changed.
          if (user.picture !== checkUser.picture) {
            const imageFile = await fileDB.findOne({ _id: user.picture });
            const imageResult = await ImageProcessing.scaleAndCrop(imageFile.path, null, 32, 32);
            if (imageResult.success) {
              user.icon = `data:${imageFile.mimetype};base64,${imageResult.data}`;
            }
            console.log('icon', user.icon)
          }

          // Remove permissions on roles.
          const roles = [];
          if (user.roles) {
            user.roles.map(role => roles.push({role: role.role._id}));
            user.roles = roles;
          }

          // Update user in the database.
          const updatedUser = await userDB.update({ _id: user._id }, user);
          return user;
        } else {
          throw({status: 404, message: "Impossible de modifier cet utilisateur, aucun utilisateur n'a été trouvé.", error: null});
        }
      }
      catch(e) {
        console.log(e)
        if (e.status === 403) {
          throw({status: 403, message: "Mot de passe invalide.", error: e})
        }
        throw({status: 500, message: "Une erreur s'est produite lors de la mise à jour de l'utilisateur.", error: e});
      }
    } else {
      throw({status: 500, message: "Impossible de modifier cet utilisateur, l'utilisateur n'a pas d'identifiant.", error: null});
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
