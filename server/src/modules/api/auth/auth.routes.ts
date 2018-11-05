import * as express from 'express';
import { Request, Response } from 'express';

import { CONFIG } from "../../../config";

import { AuthStrategyToken } from "../../security/authentication-token-strategy";
import { PasswordStrategy } from "../../security/password-strategy";

const nodemailer = require('nodemailer');
const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);

export class AuthRoutes {

  // Check Authentication and return the user
  public static async checkAuth(req: Request, res: Response) {
    const data = await AuthRoutes.findUserBySub(req['user']);
    if (data.success) {
      res.json({success:true, user: data.user});
    }
    else {
      res.status(data.status).json({message: data.message, success: data.success});
    }
  }

  // Log in route
  public static loginRoute(req: Request, res: Response) {
    const credentials = req.body;
    if (!credentials.username || !credentials.password) {
      return res.status(400).json({message: "Les champs username et password sont obligatoires.", success: false});
    }
    userDB.findOne({ username: credentials.username })
      .then((user) => {
        if (user) {
          return AuthStrategyToken.login(credentials.password, user, res)
            .then(result => {
              delete(result.user.password);
              return res.json({user: result.user, token: result.token, success: true});
            })
            .catch((error) => res.status(error.status).json({message: error.message, success: false}));
        } else {
          return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false}));
  }

  // Sign up route
  public static signUpRoute(req: Request, res: Response) {
    const credentials = req.body;

    // Register with auth0.
    if (req["user"] && req["user"].sub) {
      credentials.sub = req["user"].sub
      return userDB.insert(credentials)
        .then((userInserted) => {
          return res.json(userInserted);
        });
    }

    // Register with token.
    const errors = PasswordStrategy.validate(credentials.password);
    if (errors.length > 0) {
      const err:string[] = [];
      errors.map(e => {
        switch (e) {
          case 'min' : err.push('au minimum 10 caractères');break;
          case 'uppercase' : err.push('des majuscules');break;
          case 'min' : err.push('des minuscules');break;
          case 'spaces' : err.push("aucun d'espace");break;
          case 'digits' : err.push("des chiffres");break;
          case 'oneOf' : err.push("être différent de Passw0rd ou Password123");break;
        }
      });
      return res.status(400).json({message: 'Le mot de passe doit avoir ' + err.join(', '), success: false});
    }

    if (!credentials.username || !credentials.password) {
      return res.status(400).json({message: "Les champs username et password sont obligatoires.", success: false});
    }
    return userDB.findOne({ username: credentials.username, password: credentials.password }, { password: 0 })
      .then((user) => {
        if (!user) {
          return PasswordStrategy.getPasswordDigest(credentials.password)
            .then((passwordDigest) => {
              credentials.password = passwordDigest;
              credentials.sub = 'token-' + credentials.username + '|' + Date.now();
              return userDB.insert(credentials)
              .then((userInserted) => {
                AuthStrategyToken.signup(userInserted, res)
                  .then((user) => {
                    return res.json(user);
                  })
                  .catch((error) => res.status(error.status).json({message: error.message, success: false}));
              })
              .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de l'insertion de l'utilisateur", success: false}));
          })
          .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors du traitement d'authentification", success: false}));
        } else {
          return res.status(403).json({message: "L'utilisateur existe déjà.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la vérification de l'existance de l'utilisateur.", success: false}));
  }

  // Log out route
  public static logoutRoute(req: Request, res: Response) {
    AuthStrategyToken.logout(res);
    res.json({success: true});
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
          } else {
            return res.json({mailID: info.response, success: true});
          };
        });
      } else {
        return res.status(401).json({message: "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré", success: false});
      }
    })
    .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la récupération de l'utilisateur", success: false}));
  }

  // Fetch the user by sub
  public static async findUserBySub(userInfo) {
    if (userInfo) {
      return userDB.findOne({sub: userInfo.sub}).then(function(user) {
        if (user) {
          return {success:true, user: user};
        } else {
          return {message: "Aucun utilisateur n'a été trouvé.", success: false, status: 404};
        }
      })
      .catch((error) => {
        return {message: "Une erreur s'est produit lors de la vérification de l'existance de l'utilisateur.", success: false, status: 500};
      });
    }
    else {
      return {message: "Aucun utilisateur n'a été trouvé.", success: false, status: 404};
    }
  }

}
