import * as express from 'express';
import { AuthRoutes }  from "../api/auth/auth.routes";
import { UsersRoutes }  from "../api/users/users.routes";
import { RolesRoutes }  from "../api/roles/roles.routes";
import { FilesRoutes }  from "../api/files/files.routes";
import { Authentication } from '../authentication';

const app = express();

export class APIRoutes {

    routes() {
      // Authentication
      app.post("/login", AuthRoutes.loginRoute);
      app.post("/signup", AuthRoutes.signUpRoute);
      app.post("/retrieve-password", AuthRoutes.getPswRoute);
      app.use("/api", Authentication.authenticatedRoute);
      app.get("/api/check-auth", AuthRoutes.checkAuth);

      // Users
      app.get("/api/users/list/:from?/:to?", UsersRoutes.list);
      app.get("/api/users/get/:id", UsersRoutes.get);
      app.post("/api/users/create", UsersRoutes.create);
      app.post("/api/users/update", UsersRoutes.update);
      app.get("/api/users/remove/:id", UsersRoutes.remove);

      // Roles
      app.get("/api/roles/list/:from?/:to?", RolesRoutes.list);
      app.get("/api/roles/get/:id", RolesRoutes.get);
      app.post("/api/roles/create", RolesRoutes.create);
      app.post("/api/roles/update", RolesRoutes.update);
      app.get("/api/roles/remove/:id", RolesRoutes.remove);

      // Files
      app.post("/api/files/upload", FilesRoutes.uploadFile);
      app.get("/api/files/delete", FilesRoutes.deleteFile);
      app.get("/files/view/:id", FilesRoutes.viewFile);

      return app;
    }

}
