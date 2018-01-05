import * as express from 'express';
import { Request, Response } from 'express';

import { CONFIG } from "../../../config";

import { AuthStrategy } from "../../security/authentication-strategy";
import { PasswordStrategy } from "../../security/password-strategy";

const nodemailer = require('nodemailer');
const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);

export class AuthRoutes {

  // Check Authentication and return the user
  public static checkAuth(req, res): void {
    const userInfo = req["user"];
    if (userInfo) {
      // Fetch the user by id
      userDB.findOne({_id: userInfo.sub}).then(function(user) {
        if (user) {
          return res.json({success:true, user: user});
        } else {
          return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la vérification de l'existance de l'utilisateur.", success: false}));
    }
    else {
      return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
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
          return AuthStrategy.login(credentials.password, user, res)
            .then(user => {
              delete(user.password);
              return res.json({user: user, success: true});
            })
            .catch((error) => res.status(error.status).json({message: error.message, success: false}));
        } else {
          return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
        }
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false}));
  }

  // Sign up route
  public static signUpRoute(req, res): void {
    const credentials = req.body;
    const errors = PasswordStrategy.validate(credentials.password);
    if (errors.length > 0) {
      return res.status(400).json({message: errors, success: false});
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
              return userDB.insert(credentials)
              .then((userInserted) => {
                AuthStrategy.signup(userInserted, res)
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
    AuthStrategy.logout(res);
    res.sendStatus(200);
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
