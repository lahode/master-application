/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   24-12-2016
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 27-03-2017
*/

import * as express from 'express';
import { UsersRoutes }  from "../api/users/users.routes";
import { Authentication } from '../authentication';

const app = express();

export class APIRoutes {

    routes() {
      app.post("/login", UsersRoutes.loginRoute);
      app.post("/signup", UsersRoutes.signUpRoute);
      app.post("/retrieve-password", UsersRoutes.getPswRoute);
      app.use('/api', Authentication.authenticatedRoute);
      app.get('/api/authenticate', (req, res) => res.json('ok'));
      return app;
    }

}
