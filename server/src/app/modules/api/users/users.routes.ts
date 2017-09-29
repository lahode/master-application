import * as express from 'express';
const fs = require('fs'); /* module file system */
const nodemailer = require('nodemailer');
import { sign } from 'jsonwebtoken';

import { log } from '../../log';

// Import secretTokenKey config
import { SECRET_TOKEN_KEY, MAILER, USERS_FILE } from "../../../config";

const router = express.Router();

export class UsersRoutes {

    // Sign in and save token
    public static saveToken(req, cb: (tokenSaved: boolean|any) => void): void {
      let token = sign(req, SECRET_TOKEN_KEY, {
        expiresIn: 60 * 60 * 24 // Expire dans 24 heures
      }, (err: Error, token: any): void => {
        if (err) {
          cb(false);
        }
        // Token success
        cb({success:true, user: req, token: token});
      });
    }

    // Log in route
    public static loginRoute(req, res): void {
      let userAuth;
      if (!req.body.username || !req.body.password) {
        return res.end(res.writeHead(400, "Tous les champs sont obligatoires."));
      }
      fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
          return res.end(res.writeHead(500, "Une erreur lors de la récupération des utilisateurs."));
        }
        else {
          let users = JSON.parse(data);
          for (let user of users) {
            if (req.body.username == user.username && req.body.password == user.password) {
              userAuth = Object.assign({}, user);
              delete userAuth.password;
            }
          }

          if(!userAuth) {
            return res.end(res.writeHead(401, "Erreur d'authentification"));
          }
          else {
            UsersRoutes.saveToken(userAuth, (tokenSaved: boolean|any): void => {
              if (tokenSaved) {
                return res.json(tokenSaved);
              } else {
                res.status(403).json({
                  message: "Une erreur est survenue dans la génération du jeton d'authentification.",
                  success: false
                });
              }
            });
          }
        }
      });
    }

    // // Sign up route
    public static signUpRoute(req, res): void {
      let userExists;
      //let users = []; /* récupère les utilisateurs */
      if (!req.body.username || !req.body.password) {
        return res.end(res.writeHead(400, "Tous les champs sont obligatoires."));
      }
      fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
          return res.end(res.writeHead(500, "Une erreur lors de la récupération des utilisateurs."));
        }
        else {
          let users = JSON.parse(data);
          for (let user of users) {
            if (req.body.username == user.username) {
              userExists = user;
            }
          }
          if(!userExists) {
            let userAuth = Object.assign({}, req.body);
            delete userAuth.password;
            users.push(req.body);
            let json = JSON.stringify(users);
            fs.writeFile(USERS_FILE, json, 'utf8', (err) => {
              if (err) {
                return res.end(res.writeHead(500, "Une erreur est survenu lors de l'inscription."));
              }
              else {
                UsersRoutes.saveToken(userAuth, (tokenSaved: boolean|any): void => {
                  if (tokenSaved) {
                    return res.json(tokenSaved);
                  } else {
                    res.status(403).json({
                      message: "Une erreur est survenue dans la génération du jeton d'authentification.",
                      success: false
                    });
                  }
                });
              }
            });
          } else {
            return res.end(res.writeHead(403, "L'utilisateur existe déjà."));
          }
        }
      });
    }

    public static getPswRoute(req, res): void {
      let findPassword;
      if (!req.body.email || !req.body.email) {
        return res.end(res.writeHead(400, "Aucun e-mail valide n'a été inséré."));
      }
      const transporter = nodemailer.createTransport(MAILER);
      const mailOptions = {
        from: MAILER.host.user,
        to: req.body.email,
        subject: 'Récupération du mot de passe',
        text: ''
      };
      fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
          return res.end(res.writeHead(500, "Une erreur lors de la récupération des utilisateurs."));
        }
        else {
          let users = JSON.parse(data);
          for (let user of users) {
            if (req.body.email == user.email) {
              findPassword = user.password;
            }
          }
          if(!findPassword) {
            return res.end(res.writeHead(401, "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré"));
          }
          else {
            mailOptions.text = findPassword;
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                return res.end(res.writeHead(500, error));
              }else{
                return res.json({mailID: info.response});
              };
            });
          }
        }
      });
    }

}
