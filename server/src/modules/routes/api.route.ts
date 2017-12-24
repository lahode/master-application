import * as express from 'express';
import { UsersRoutes }  from "../api/users/users.routes";
import { FilesRoutes }  from "../api/files/files.routes";
import { Authentication } from '../authentication';

const app = express();

export class APIRoutes {

    routes() {
      // Authentication
      app.post("/login", UsersRoutes.loginRoute);
      app.post("/signup", UsersRoutes.signUpRoute);
      app.post("/retrieve-password", UsersRoutes.getPswRoute);
      app.use("/api", Authentication.authenticatedRoute);
      app.get("/api/check-auth", UsersRoutes.checkAuth);

      // Files
      app.post("/api/files/upload", FilesRoutes.uploadFile);
      app.post("/api/files/multiple-upload", FilesRoutes.uploadFiles)
      app.get("/files/view/:id", FilesRoutes.viewFile);

      return app;
    }

}
