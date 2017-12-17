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
      app.get("/api/check-auth", UsersRoutes.checkAuth);  
      return app;
    }

}
