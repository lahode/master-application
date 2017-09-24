import * as express from 'express';
const fs = require('fs'); /* module file system */
import { sign } from 'jsonwebtoken';

import { log } from '../../log';

// Import secretTokenKey config
import { SECRET_TOKEN_KEY } from "../../../config";
import { USERS_FILE } from "../../../config";

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
              userAuth = {username: user.username};
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
            let userAuth = {username: req.body.username};
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

}
