import { Request, Response } from 'express';

import { CONFIG } from "../../../config";
import { Mailer } from '../../common/mailer';
import { AuthStrategyToken } from "../../security/authentication-token-strategy";
import { PasswordStrategy } from "../../security/password-strategy";
import { UsersRoutes } from "../users/users.routes";
import { returnHandler } from '../../common/return-handlers';

import { userDB } from '../users/users.db';

export class AuthRoutes {

  // Check authentication route.
  public static async checkAuth(req: Request, res: Response) {

    try {
      // Get auth token from reset authenticate or standard user payload.
      if (req.params.resetauth) {
        req['user'] = await AuthStrategyToken.getPayloadByToken(`${req.params.resetauth}|jwt`);
      }

      // Check if the user exists.
      let currentUser = await UsersRoutes.findUserBySub(req);
      if (currentUser) {

        // Save user sub if reset authentication token has been sent.
        if (req.params.resetauth) {
          currentUser['sub'] = req['user'].sub;
          await userDB.findOneAndUpdate({ _id: currentUser._id }, currentUser);
        }

        // Check if user is active.
        if (currentUser.active) {
          return res.json( returnHandler( { user: currentUser } ) );
        } else {
          return res.status(401).json( returnHandler(null, "Votre compte n'est pas actif pour le moment.") );
        }
      }
    }
    catch (e) {
      if (e.status && e.message) {
        return res.status(e.status).json( returnHandler(null, e.message, e) );
      }
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la vérification de l'utilisateur.", e) );
    }
  }

  // Log in route.
  public static async loginRoute(req: Request, res: Response) {
    const credentials = req.body;
    if (!credentials.username || !credentials.password) {
      return res.status(400).json( returnHandler(null, "Les champs username et password sont obligatoires.") );
    }
    try {
      // Find the user in the database.
      const user = await userDB.findOne({ $or: [{ username: credentials.username}, { email: credentials.username }] })
                               .populate('roles.role');;
      if (user) {
        // Check if password authentification is ok.
        const result = await AuthStrategyToken.login(credentials.password, user, res);
        if (result) {
          // Remove the password in the user data and return it.
          delete(result.user.password);
          return res.json( returnHandler( { user: result.user, token: result.token } ) );
        }
      } else {
        return res.status(404).json( returnHandler(null, "Aucun utilisateur n'a été trouvé.") );
      }
    }
    catch (e) {
      if (e.status && e.message) {
        return res.status(e.status).json( returnHandler(null, e.message, e) );
      }
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération de l'utilisateur.", e) );
    }
  }

  // Sign up route
  public static async signUpRoute(req: Request, res: Response) {
    const credentials = req.body;

    // Register with auth0.
    if (req["user"] && req["user"].sub) {
      let userInserted = null;
      try {
        const user = await userDB.findOne({$or: [{ username: credentials.username }, { email: credentials.email }]}, { password: 0 });
        if (!user) {
          credentials.sub = req["user"].sub;
          credentials.active = 0;

          // Insert the user into the database.
          userInserted = await userDB.create(credentials);
        } else {
          return res.status(403).json( returnHandler(null, "L'utilisateur existe déjà avec cet identifiant ou e-mail.") );
        }
      }
      catch (e) {
        return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la création de l'utilisateur.", e) );
      }

      // Send a mail.
      try {
        await Mailer.sendMail('Création de compte', req.body.email, `<p>Votre compte a été créé.</p><p>Il vous faut cependant attendre la validation de l'administrateur pour activer ce dernier.</p><p>Merci de votre compréhension</p>`);
        return res.json( returnHandler( {user: userInserted} ) );
      }
      catch (e) {
        return res.status(500).json( returnHandler(null, "Impossible d'envoyer un mail, vérifier la configuration de votre boîte.", e) );
      }
    }

    // If no username or password exists for user registration exit the route.
    if (!credentials.username || !credentials.password) {
      return res.status(400).json( returnHandler(null, "Les champs username et password sont obligatoires.") );
    }

    // Check password strategy.
    const errorValidatePassword = AuthRoutes.checkPasswordStrategy(credentials.password);
    if (errorValidatePassword) {
      return res.status(400).json( returnHandler(null, errorValidatePassword) );
    }

    // Sign up the new user.
    let userSignedUp = null;
    try {
      const user = await userDB.findOne({$or: [{ username: credentials.username }, { email: credentials.email }]}, { password: 0 });
      if (!user) {

        // Get an encrypted password and set the new token name.
        const passwordDigest = await PasswordStrategy.getPasswordDigest(credentials.password);
        credentials.password = passwordDigest;
        credentials.sub = 'token-' + credentials.username + '|' + Date.now();
        credentials.active = 0;

        // Insert the user into the database.
        const userInserted = await userDB.create(credentials);

        // Create the new token with the user and return the user and the token.
        userSignedUp = await AuthStrategyToken.signup(userInserted);
        delete(userSignedUp.user.password);
      } else {
        return res.status(403).json( returnHandler(null, "L'utilisateur existe déjà avec cet identifiant ou e-mail.") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la création de l'utilisateur.", e) );
    }

    // Send a mail.
    try {
      await Mailer.sendMail('Création de compte', req.body.email, `<p>Votre compte a été créé.</p><p>Il vous faut cependant attendre la validation de l'administrateur pour activer ce dernier.</p><p>Merci de votre compréhension</p>`);
      return res.json( returnHandler( userSignedUp ) );
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Impossible d'envoyer un mail, vérifier la configuration de votre boîte.", e) );
    }
  }

  // Log out route
  public static logoutRoute(req: Request, res: Response) {
    AuthStrategyToken.logout(res);
    res.json( returnHandler( {} ) );
  }

  // Send new password route
  public static async sendPswRoute(req: Request, res: Response) {
    // Check if an e-mail has been given.
    if (!req.body.email || !req.body.email) {
      return res.status(400).json( returnHandler(null, "Aucun e-mail valide n'a été inséré." ) );
    }
    let newToken = null;

    try {
      // Find the user in the database.
      const user = await userDB.findOne({ email: req.body.email});
      if (user) {
        // Create a new token and attach it to the message.
        newToken = await AuthStrategyToken.signup(user, 300);
      } else {
        return res.status(401).json( returnHandler(null, "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la récupération de l'utilisateur", e) );
    }

    // Send a mail.
    try {
      const sentMail = await Mailer.sendMail('Récupération du mot de passe', req.body.email, `Veuillez cliquer sur ce lien pour <a href="${CONFIG.FRONTEND}/reset-password?reset=${newToken.token}">récupérer votre mot de passe.</a>`);
      return res.json( returnHandler( { mailID: sentMail['mailID'] } ) );
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Impossible d'envoyer un mail, vérifier la configuration de votre boîte.", e) );
    }
  }

  // Reinitialize the new password route
  public static async initPswRoute(req: Request, res: Response) {
    const credentials = req.body;

    // Check if an e-mail has been given.
    if (!credentials.password) {
      return res.status(400).json( returnHandler(null, "Un nouveau mot de passe est obligatoire.") );
    }

    // Check password strategy.
    const errorValidatePassword = AuthRoutes.checkPasswordStrategy(credentials.password);
    if (errorValidatePassword) {
      return res.status(400).json( returnHandler(null, errorValidatePassword) );
    }

    try {
      // Find the user in the database.
      req['user'] = await AuthStrategyToken.getPayloadByToken(`${credentials.token}|jwt`);
      const currentUser = await UsersRoutes.findUserBySub(req);
      if (currentUser) {
        // Get an encrypted password and update it in the database.
        const passwordDigest = await PasswordStrategy.getPasswordDigest(credentials.password);
        const user = currentUser;
        user.password = passwordDigest;
        await userDB.findOneAndUpdate({ _id: user._id }, user);
        delete(user.password);

        // Create the new token with the user and return the user and the token.
        const newToken = await AuthStrategyToken.signup(user);
        return res.json( returnHandler( {user: newToken.user, token: newToken.token} ) );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la récupération de l'utilisateur", e) );
    }
  }

  // Check password validity.
  public static checkPasswordStrategy(password: string): string {
    const errors = PasswordStrategy.validate(password);
    if (errors.length > 0) {
      const err:string[] = [];
      errors.map((e: string) => {
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
