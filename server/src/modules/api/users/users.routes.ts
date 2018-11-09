import { CONFIG } from "../../../config";
import { AuthRoutes } from "../auth/auth.routes";
import { PasswordStrategy } from "../../security/password-strategy";

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
          return {success:true, user: user};
        } else {
          return {error: 404, message: "Aucun utilisateur n'a été trouvé.", success: false};
        }
      }
      catch (e) {
        return {error: 500, message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false};
      }
    }
    else {
      return {error: 500, message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false};
    }
  }

  // Get user by ID route.
  public static async get(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    // Find a user by it's ID.
    try {
      const user = await userDB.findOne({ _id: req.params.id });
      user.password = '';
      return res.json({user: user, success: true});
    }
    catch(e) {
      return res.status(500).json({message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false});
    }
  }

  // Get all users route
  public static async list(req, res) {
    try {
      // Find all active users in the database.
      const users = await userDB.find({}, {username: 1, email: 1, active: 1}).sort({title: 1})
      if (users) {
        let results = [];
        // Loop on each users and limit of "from" and "to" parameters have been set
        users.map((users, index) => {
          if (req.params.from && req.params.to) {
            if (index >= parseInt(req.params.from) && index <= parseInt(req.params.to)) {
              results.push(users);
            }
          }
          else {
            results.push(users);
          }
        });
        return res.json({items: results, total: users.length, success: true});
      } else {
        return res.status(404).json({message: "Aucun utilisateur n'a été trouvée.", success: false});
      }
    }
    catch(e) {
      return res.status(500).json({message: "Une erreur s'est produite lors de la récupération des utilisateurs.", success: false});
    }
  }

  // Create user route.
  public static async create(req, res) {
    if (!req.body.username) {
      return res.status(400).json({message: "Un utilisateur doit avoir au moins un nom d'utilisateur.", success: false});
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
        return res.json({user: userInserted, success: true});
      }
      catch(e) {
        return res.status(500).json({message: "Une erreur s'est produit lors de l'insertion de l'utilisateur", success: false});
      }
    }
    else {
      return res.status(500).json({message: "Impossible d'insérer cet utilisateur, l'utilisateur existe déjà.", success: false});
    }
  }

  // Update user route.
  public static async update(req, res) {
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
                return res.status(400).json({message: errorValidatePassword, success: false});
              }

              // Get an encrypted password and set the new token name.
              const passwordDigest = await PasswordStrategy.getPasswordDigest(passwordnew);
              user.password = passwordDigest;
            }
          } else {
            if (user.username != checkUser.username || user.passwordnew) {
              return res.status(400).json({message: "Le mot de passe actuel est obligatoire pour modifier le nom d'utilisateur ou mot de passe", success: false});
            }
            user.username = checkUser.username;
          }
          delete(user.passwordcurrent);
          delete(user.passwordnew);

          // Update user in the database.
          const updatedUser = await userDB.update({ _id: user._id }, user);
          return res.json({user: user, success: true});
        } else {
          return res.status(404).json({message: "Impossible de modifier cet utilisateur, aucun utilisateur n'a été trouvé.", success: false});
        }
      }
      catch(e) {
        if (e.status === 403) {
          return res.status(403).json({message: "Mot de passe invalide.", success: false});
        }
        return res.status(500).json({message: "Une erreur s'est produite lors de la mise à jour de l'utilisateur.", success: false});
      }
    } else {
      return res.status(500).json({message: "Impossible de modifier cet utilisateur, l'utilisateur n'a pas d'identifiant.", success: false});
    }

  }

  // Delete user route.
  public static async remove(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    try {
      // Check if the user exists.
      const checkUser = await userDB.findOne({ _id: req.params.id });
      if (checkUser) {

        //Delete the user in the database.
        const userDeleted = await userDB.remove({ _id: req.params.id });
        return res.json({deleted: req.params.id, success: true});
      } else {
        return res.status(404).json({message: "Impossible de supprimer cet utilisateur, aucun utilisateur n'a été trouvé.", success: false});
      }
    } catch(e) {
      return res.status(500).json({message: "Une erreur s'est produite lors de la suppression de l'utilisateur.", success: false});
    }
  }

}
