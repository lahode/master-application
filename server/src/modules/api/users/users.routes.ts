import * as express from 'express';
import { sign, verify } from 'jsonwebtoken';
import { CONFIG } from "../../../config";

const nodemailer = require('nodemailer');
const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.USERS_FILE);
const router = express.Router();

export class UsersRoutes {

  // Sign in and save token
  public static saveToken(req, cb: (tokenSaved: boolean|any) => void): void {
    let token = sign(req, CONFIG.SECRET_TOKEN_KEY, {
      expiresIn: 60 * 60 * 24 // Expire dans 24 heures
    }, (err: Error, token: any): void => {
      if (err) {
        cb(false);
      }
      // Token success
      cb({success:true, user: req, token: token});
    });
  }

  // Get user by ID route
  public static async getUsersByID(ids) {
    let results = [];
    for (let id of ids) {
      let result = await userDB.findOne({ _id: id })
        .then((user) => {
          if (user) {
            return {data: user, success: true};
          } else {
            return {error: 404, message: "Aucun utilisateur n'a été trouvé.", success: false};
          }
        })
        .catch((error) => {
          return {error: 500, message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false}
        });
        if (result.hasOwnProperty('data')) {
          results.push(result.data);
        }
    }
    return results;
  }

  // Check Authentication and return the user
  public static checkAuth(req, res): void {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization, decoded;
      try {
        let header = authorization.split(' ');
        decoded = verify(header[1], CONFIG.SECRET_TOKEN_KEY);
      } catch (e) {
        return res.status(401).json({message: "Vous n'êtes pas autorisé à accéder.", success: false});
      }
      // Fetch the user by id
      userDB.findOne({_id: decoded._id}).then(function(user) {
        if (user) {
          return res.json({success:true, user: user});
        } else {
          return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la vérification de l'existance de l'utilisateur.", success: false}));
    }
    else {
      return res.status(500).json({message: "Erreur, en-têtes manquantes ou invalides.", success: false});
    }
  }

  // Log in route
  public static loginRoute(req, res): void {
    let userAuth;
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({message: "Les champs username et password sont obligatoires.", success: false});
    }
    userDB.findOne({ username: req.body.username, password: req.body.password }, { password: 0 })
      .then((user) => {
        if (user) {
          let userAuth = Object.assign({}, user);
          delete userAuth.password;
          UsersRoutes.saveToken(userAuth, (tokenSaved: boolean|any): void => {
            if (tokenSaved) {
              return res.json(tokenSaved);
            } else {
              res.status(403).json({message: "Une erreur est survenue dans la génération du jeton d'authentification.", success: false});
            }
          });
        } else {
          return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false}));
  }

  // Sign up route
  public static signUpRoute(req, res): void {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({message: "Les champs username et password sont obligatoires.", success: false});
    }
    userDB.findOne({ username: req.body.username, password: req.body.password }, { password: 0 })
      .then((user) => {
        if (!user) {
          return userDB.insert(req.body)
          .then((userInserted) => {
            let userAuth = Object.assign({}, userInserted);
            delete userAuth.password;
            UsersRoutes.saveToken(userAuth, (tokenSaved: boolean|any): void => {
              if (tokenSaved) {
                return res.json(tokenSaved);
              } else {
                res.status(403).json({message: "Une erreur est survenue dans la génération du jeton d'authentification.", success: false});
              }
            });
          })
          .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de l'insertion de l'utilisateur", success: false}));
        } else {
          return res.status(403).json({message: "L'utilisateur existe déjà.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la vérification de l'existance de l'utilisateur.", success: false}));
  }

  // Get password route
  public static getPswRoute(req, res): void {
    let findPassword;
    if (!req.body.email || !req.body.email) {
      return res.status(400).json({message: "Aucun e-mail valide n'a été inséré.", success: false});
    }
    const transporter = nodemailer.createTransport(CONFIG.MAILER);
    const mailOptions = {
      from: CONFIG.MAILER.host.user,
      to: req.body.email,
      subject: 'Récupération du mot de passe',
      text: ''
    };
    userDB.findOne({ email: req.body.email}, { email: 1, password: 1, _id: 0 })
    .then((user) => {
      if (user) {
        mailOptions.text = user.password;
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            return res.status(500).json({message: "Une erreur s'est produite lors de l'envoi du mail", success: false});
          } else{
            return res.json({mailID: info.response, success: true});
          };
        });
      } else {
        return res.status(401).json({message: "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré", success: false});
      }
    })
    .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la récupération de l'utilisateur", success: false}));
  }

}
