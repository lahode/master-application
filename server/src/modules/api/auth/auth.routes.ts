import { Request, Response } from 'express';

import { CONFIG } from "../../../config";

import { AuthStrategyToken } from "../../security/authentication-token-strategy";
import { PasswordStrategy } from "../../security/password-strategy";
import { UsersRoutes } from "../users/users.routes";

import * as nodemailer from 'nodemailer';
const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);

export class AuthRoutes {

  // Check authentication route.
  public static async checkAuth(req: Request, res: Response) {
    // Check if the user exists.
    const data = await UsersRoutes.findUserBySub(req['user']);
    if (data.success) {
      res.json({success:true, user: data.user});
    }
    else {
      res.status(data.error).json({message: data.message, success: data.success});
    }
  }

  // Log in route.
  public static async loginRoute(req: Request, res: Response) {
    const credentials = req.body;
    if (!credentials.username || !credentials.password) {
      return res.status(400).json({message: "Les champs username et password sont obligatoires.", success: false});
    }
    try {
      // Find the user in the database.
      const user = await userDB.findOne({ username: credentials.username });
      if (user) {
        // Check if password authentification is ok.
        const result = await AuthStrategyToken.login(credentials.password, user, res);
        if (result) {
          // Remove the password in the user data and return it.
          delete(result.user.password);
          return res.json({user: result.user, token: result.token, success: true});
        }
      } else {
        return res.status(404).json({message: "Aucun utilisateur n'a été trouvé.", success: false});
      }
    }
    catch (e) {
      if (e.status && e.message) {
        return res.status(e.status).json({message: e.message, success: false});
      }
      return res.status(500).json({message: "Une erreur s'est produite lors de la récupération de l'utilisateur.", success: false});
    }
  }

  // Sign up route
  public static async signUpRoute(req: Request, res: Response) {
    const credentials = req.body;

    // Register with auth0.
    if (req["user"] && req["user"].sub) {
      try {
        credentials.sub = req["user"].sub;
        // Insert the user into the database.
        const userInserted = await userDB.insert(credentials);
        return res.json({user: userInserted, success: true})
      }
      catch (e) {
        return res.status(500).json({message: "Une erreur s'est produite lors de la création de l'utilisateur", success: false});
      }
    }

    // If no username or password exists for user registration exit the route.
    if (!credentials.username || !credentials.password) {
      return res.status(400).json({message: "Les champs username et password sont obligatoires.", success: false});
    }

    // Check password strategy.
    const errorValidatePassword = AuthRoutes.checkPasswordStrategy(credentials.password);
    if (errorValidatePassword) {
      return res.status(400).json({message: errorValidatePassword, success: false});
    }

    // Sign up the new user.
    try {
      const user = await userDB.findOne({ username: credentials.username, password: credentials.password }, { password: 0 });
      if (!user) {
        // Get an encrypted password and set the new token name.
        const passwordDigest = await PasswordStrategy.getPasswordDigest(credentials.password);
        credentials.password = passwordDigest;
        credentials.sub = 'token-' + credentials.username + '|' + Date.now();

        // Insert the user into the database.
        const userInserted = await userDB.insert(credentials);

        // Create the new token with the user and return the user and the token.
        const userSignedUp = await AuthStrategyToken.signup(userInserted, res);
        delete(userSignedUp.user.password);
        res.json(userSignedUp);
      } else {
        return res.status(403).json({message: "L'utilisateur existe déjà.", success: false});
      }
    }
    catch (e) {
      return res.status(500).json({message: "Une erreur s'est produite lors de la création de l'utilisateur", success: false});
    }
  }

  // Log out route
  public static logoutRoute(req: Request, res: Response) {
    AuthStrategyToken.logout(res);
    res.json({success: true});
  }

  // Get password route
  public static async getPswRoute(req, res) {
    // Check if an e-mail has been given.
    if (!req.body.email || !req.body.email) {
      return res.status(400).json({message: "Aucun e-mail valide n'a été inséré.", success: false});
    }

    // Initialize e-mail parameters.
    const transporter = nodemailer.createTransport(CONFIG.MAILER);
    const mailOptions = {
      from: CONFIG.MAILER.host.user,
      to: req.body.email,
      subject: 'Récupération du mot de passe',
      text: ''
    };

    try {
      // // Find the user in the database.
      const user = await userDB.findOne({ email: req.body.email}, { email: 1, password: 1, _id: 0 });
      if (user) {
        mailOptions.text = user.password;

        // Send the e-mail to the e-mail.
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({message: "Une erreur s'est produite lors de l'envoi du mail", success: false});
          } else {
            return res.json({mailID: info.response, success: true});
          };
        });
      } else {
        return res.status(401).json({message: "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré", success: false});
      }
    }
    catch (e) {
      return res.status(500).json({message: "Une erreur s'est produit lors de la récupération de l'utilisateur", success: false});
    }
  }

  // Check password validity.
  public static checkPasswordStrategy(password): string {
    const errors = PasswordStrategy.validate(password);
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
      return 'Le mot de passe doit avoir ' + err.join(', ');
    }
    return null;
  }

}
