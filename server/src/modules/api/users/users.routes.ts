import * as express from 'express';
import { sign, verify } from 'jsonwebtoken';
import { CONFIG } from "../../../config";
import { AuthRoutes } from "../auth/auth.routes";
import { PasswordStrategy } from "../../security/password-strategy";

const nodemailer = require('nodemailer');
const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);
const fileDB = new Datastore(CONFIG.DATABASE.FILES);
const router = express.Router();

import { AuthStrategyToken } from "../../security/authentication-token-strategy";

export class UsersRoutes {

  // Get user by ID route
  public static async getUsersByID(ids) {
    let results = [];
    for (let id of ids) {
      let result = await userDB.findOne({ _id: id })
        .then((user) => {
          if (user) {
            delete(user.password);
            return {data: user, success: true};
          } else {
            return {error: 404, message: "Aucun utilisateur n'a été trouvé.", success: false};
          }
        })
        .catch(() => {
          return {error: 500, message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false};
        });
        if (result.hasOwnProperty('data')) {
          results.push(result.data);
        }
    }
    return results;
  }

  // Fetch the user by sub
  public static async findUserBySub(userInfo) {
    if (userInfo) {
      try {
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

  // Get user by ID route
  public static get(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    // Find a user by it's ID
    userDB.findOne({ _id: req.params.id })
      .then((user) => {
        user.password = '';
        return res.json({user: user, success: true});
      })
      .catch(() => res.status(500).json({message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false}));
  }

  // Get all users route
  public static list(req, res): void {
    // Find all users
    userDB.find({}, {username: 1, active: 1})
    .sort({title: 1})
    .then((users) => {
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
    })
    .catch(() => res.status(500).json({message: "Une erreur s'est produite lors de la récupération des utilisateurs.", success: false}));
  }

  // Create user route
  public static create(req, res): void {
    if (!req.body.username) {
      return res.status(400).json({message: "Un utilisateur doit avoir au moins un nom d'utilisateur.", success: false});
    }
    let user = Object.assign({}, req.body);

    // Check if ID exists
    if (!user._id) {
      if (typeof user.owner !== 'string') {
        user.owner = user.owner._id;
      }
      user.created = new Date().toISOString();
      user.updated = new Date().toISOString();
      user.active = true;
      return userDB.insert(user)
        .then((inserted) => {
          if (inserted) {
            return res.json({user: inserted, success: true});
          }
          return res.status(500).json({message: "Une erreur est survenue au moment de la sauvegarde de l'utilisateur", success: false});
        })
        .catch(() => res.status(500).json({message: "Une erreur s'est produit lors de l'insertion de l'utilisateur", success: false}));
    }
    else {
      return res.status(500).json({message: "Impossible d'insérer cet utilisateur, l'utilisateur existe déjà.", success: false});
    }

  }

  // Save user route
  public static async update(req, res) {
    if (!req.body.username) {
      return res.status(400).json({message: "Un utilisateur doit avoir au moins un nom d'utilisateur.", success: false});
    }
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
      userDB.findOne({ _id: user._id })
        .then((checkUser) => {
          if (checkUser) {

            // Manage password or username modifications.
            user.password = checkUser.password;
            if (user.passwordcurrent) {
              const passwordcurrent = user.passwordcurrent;
              const passwordnew = user.passwordnew || null;
              try {
                const checkPassword = AuthStrategyToken.login(passwordcurrent, user, res);
              }
              catch(e) {
                return res.status(400).json({message: "Le mot de passe que vous avez entré est invalide.", success: false});
              }
              if (passwordnew) {
                const errorValidatePassword = AuthRoutes.checkPasswordStrategy(passwordnew);
                if (errorValidatePassword) {
                  return res.status(400).json({message: errorValidatePassword, success: false});
                }
                PasswordStrategy.getPasswordDigest(passwordnew)
                  .then((passwordDigest) => {
                    user.password = passwordDigest;
                  })
                  .catch((error) => res.status(error.status).json({message: error.message, success: false}));
              }
            } else {
              user.username = checkUser.username;
            }
            delete(user.passwordcurrent);
            delete(user.passwordnew);

            // Get picture ID for user.
            user.picture = user.picture._id || undefined;

            // Update user.
            return userDB.update({ _id: user._id }, user)
              .then((updated) => {
                if (updated) {
                  return res.json({user: user, success: true});
                }
                return res.status(500).json({message: "Une erreur est survenue au moment de la sauvegarde de l'utilisateur", success: false});
              })
              .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la mise à jour de l'utilisateur.", success: false}));
          } else {
            return res.status(404).json({message: "Impossible de modifier cet utilisateur, aucun utilisateur n'a été trouvé.", success: false});
          }
        });
    }
    else {
      return res.status(500).json({message: "Impossible de modifier cet utilisateur, l'utilisateur n'a pas d'identifiant.", success: false});
    }

  }

  // Delete user route
  public static remove(req, res): void {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    userDB.findOne({ _id: req.params.id })
    .then((checkUser) => {
      if (checkUser) {
        return userDB.remove({ _id: req.params.id })
          .then((deleted) => {
            if (!deleted) {
              return res.status(404).json({message: "Aucun utilisateur n'a été trouvée.", success: false});
            } else {
              return res.json({deleted: req.params.id, success: true});
            }
          })
          .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la suppression de l'utilisateur.", success: false}));
      } else {
        return res.status(404).json({message: "Impossible de supprimer cet utilisateur, aucun utilisateur n'a été trouvé.", success: false});
      }
    });
  }

}
