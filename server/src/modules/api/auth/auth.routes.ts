import { Request, Response } from 'express';

import { CONFIG } from "../../../config";
import { Mailer } from '../../common/mailer';
import { AuthStrategyToken } from "../../security/authentication-token-strategy";
import { PasswordStrategy } from "../../security/password-strategy";
import { UsersRoutes } from "../users/users.routes";
import { returnHandler } from '../../common/return-handlers';

const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);

export class AuthRoutes {

  // Check authentication route.
  public static async checkAuth(req: Request, res: Response) {
    // Check if the user exists.
    const data = await UsersRoutes.findUserBySub(req['user']);
    if (data.success) {
      if (data.user.active) {
        return res.json( returnHandler( { user: data.user } ) );
      } else {
        return res.status(401).json( returnHandler(null, "Votre compte n'est pas actif pour le moment.") );
      }
    }
    else {
      return res.status(data.error).json( returnHandler(null, data.message) );
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
      let user = await userDB.findOne({ $or: [{ username: credentials.username}, { email: credentials.username }] });

      // Add permissions to user's roles (Can be replaced by .populate('roles.role') when using mongoose).
      user.roles = await UsersRoutes.populateRoles(user);

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
      try {
        const user = await userDB.findOne({$or: [{ username: credentials.username }, { email: credentials.email }]}, { password: 0 });
        if (!user) {
          credentials.sub = req["user"].sub;
          credentials.active = 0;

          // Insert the user into the database.
          const userInserted = await userDB.create(credentials);

          // Send the e-mail.
          const sentMail = await Mailer.sendMail('Création de compte', req.body.email, `<p>Votre compte a été créé.</p><p>Il vous faut cependant attendre la validation de l'administrateur pour activer ce dernier.</p><p>Merci de votre compréhension</p>`);

          return res.json( returnHandler( {user: userInserted} ) );
        } else {
          return res.status(403).json( returnHandler(null, "L'utilisateur existe déjà avec cet identifiant ou e-mail.") );
        }
      }
      catch (e) {
        return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la création de l'utilisateur.", e) );
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
    try {
      const user = await userDB.findOne({$or: [{ username: credentials.username }, { email: credentials.email }]}, { password: 0 });
      if (!user) {

        // Get an encrypted password and set the new token name.
        const passwordDigest = await PasswordStrategy.getPasswordDigest(credentials.password);
        credentials.password = passwordDigest;
        credentials.sub = 'token-' + credentials.username + '|' + Date.now();
        credentials.active = 0;

        // Insert the user into the database.
        const userInserted = await userDB.insert(credentials);

        // Send the e-mail.
        const sentMail = await Mailer.sendMail('Création de compte', req.body.email, `<p>Votre compte a été créé.</p><p>Il vous faut cependant attendre la validation de l'administrateur pour activer ce dernier.</p><p>Merci de votre compréhension</p>`);

        // Create the new token with the user and return the user and the token.
        const userSignedUp = await AuthStrategyToken.signup(userInserted);
        delete(userSignedUp.user.password);
        return res.json( returnHandler( userSignedUp ) );
      } else {
        return res.status(403).json( returnHandler(null, "L'utilisateur existe déjà.") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la création de l'utilisateur", e) );
    }
  }

  // Log out route
  public static logoutRoute(req: Request, res: Response) {
    AuthStrategyToken.logout(res);
    res.json( returnHandler( {} ) );
  }

  // Send new password route
  public static async sendPswRoute(req, res) {
    // Check if an e-mail has been given.
    if (!req.body.email || !req.body.email) {
      return res.status(400).json( returnHandler(null, "Aucun e-mail valide n'a été inséré." ) );
    }

    try {
      // Find the user in the database.
      const user = await userDB.findOne({ email: req.body.email});
      if (user) {
        // Create a new token and attach it to the message.
        const newToken = await AuthStrategyToken.signup(user, 300);

        // Send the e-mail.
        const sentMail = await Mailer.sendMail('Récupération du mot de passe', req.body.email, `Veuillez cliquer sur ce lien pour <a href="${CONFIG.FRONTEND}/reset-password?reset=${newToken.token}">récupérer votre mot de passe.</a>`);
        return res.json( returnHandler( { mailID: sentMail['mailID'] } ) );
      } else {
        return res.status(401).json( returnHandler(null, "Aucun compte n'a été trouvé avec l'e-mail que vous avez inséré") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la récupération de l'utilisateur", e) );
    }
  }

  // Reinitialize the new password route
  public static async initPswRoute(req, res) {
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
      const payload = await AuthStrategyToken.getPayloadByToken(`${credentials.token}|jwt`);
      const data = await UsersRoutes.findUserBySub(payload);
      if (data.success) {
        // Get an encrypted password and update it in the database.
        const passwordDigest = await PasswordStrategy.getPasswordDigest(credentials.password);
        const user = data.user;
        user.password = passwordDigest;
        const updatedUser = await userDB.update({ _id: user._id }, user);
        delete(user.password);

        // Create the new token with the user and return the user and the token.
        const newToken = await AuthStrategyToken.signup(user);
        return res.json( returnHandler( {user: newToken.user, token: newToken.token} ) );
      } else {
        return res.status(data.error).json( returnHandler(null, data.message) );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la récupération de l'utilisateur", e) );
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
