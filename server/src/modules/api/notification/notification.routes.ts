import { Request, Response } from 'express';

import { CONFIG } from "../../../config";
import { Mailer } from '../../common/mailer';
import { returnHandler } from '../../common/return-handlers';

const Datastore = require('nedb-promises');
const userDB = new Datastore(CONFIG.DATABASE.USERS);

export class NotificationRoutes {

  // Send email to list of emails route.
  public static async emails(req: Request, res: Response) {

    if (!req.body.email && !req.body.emails) {
      return res.status(400).json( returnHandler(null, "Au moins un e-mail est obligatoire") );
    }

    let sentMails = [];
    const message = req.body.message || '';

    // Send the e-mail.
    try {
      const emails = req.body.email ? [req.body.email] : req.body.emails;

      for (let email of emails) {
        const sentMail = await Mailer.sendMail('Vous avez reçu une nouvelle notification', email, message);
        sentMails.push(sentMail);
      }

      return res.json( returnHandler({results: sentMails}) );

    } catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de l'envoi de la notification.", e) );
    }
  }

  // Send email to users route.
  public static async users(req: Request, res: Response) {

    if (!req.body.userID && !req.body.users) {
      return res.status(400).json( returnHandler(null, "Au moins un utilisateur est obligatoire") );
    }

    let sentMails = [];
    const message = req.body.message || '';

    // Send the e-mail to every users.
    try {
      const users = req.body.userID ? [req.body.userID] : req.body.users;

      for (let userID of users) {
        const user = await userDB.findOne({ _id: userID }, {email: 1, emailNotify: 1});
        if (user.emailNotify) {
          console.log(user.email)
          const sentMail = await Mailer.sendMail('Vous avez reçu une nouvelle notification', user.email, message);
          sentMails.push(sentMail);
        }
      }

      return res.json( returnHandler({results: sentMails}) );

    } catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de l'envoi de la notification.", e) );
    }
  }

}
