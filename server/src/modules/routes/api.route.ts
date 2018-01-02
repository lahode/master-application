import * as express from 'express';
import { AuthRoutes }  from "../api/auth/auth.routes";
import { UsersRoutes }  from "../api/users/users.routes";
import { RolesRoutes }  from "../api/roles/roles.routes";
import { FilesRoutes }  from "../api/files/files.routes";
import { Authentication } from '../authentication';
import { Permissions } from "../permissions";

const app = express();

export class APIRoutes {

    routes() {
      // Authentication
      app.post("/login", AuthRoutes.loginRoute);
      app.post("/signup", AuthRoutes.signUpRoute);
      app.post("/retrieve-password", AuthRoutes.getPswRoute);
      app.use("/api", Authentication.authenticatedRoute);
      app.get("/api/check-auth", AuthRoutes.checkAuth);
      app.post("/api/check-permissions", RolesRoutes.checkPermissions);

      // Permission
      app.use("/api", Permissions.permissionOnRoute);

      // Users
      this.callRoute('get', "/api/users/list/:from?/:to?", UsersRoutes.list, ["manage users", "view users"]);
      this.callRoute('get', "/api/users/get/:id", UsersRoutes.get, ["manage users", "view users"]);
      this.callRoute('post', "/api/users/create", UsersRoutes.create, ["manage users"]);
      this.callRoute('post', "/api/users/update", UsersRoutes.update, ["manage users"]);
      this.callRoute('get', "/api/users/remove/:id", UsersRoutes.remove, ["manage users"]);

      // Roles
      this.callRoute('get', "/api/roles/list", RolesRoutes.list, ["manage roles"]);
      this.callRoute('get', "/api/roles/get-permissions", RolesRoutes.getPermissions, ["manage roles"]);
      this.callRoute('get', "/api/roles/get/:id", RolesRoutes.get, ["manage roles"]);
      this.callRoute('post', "/api/roles/create", RolesRoutes.create, ["manage roles"]);
      this.callRoute('post', "/api/roles/update", RolesRoutes.update, ["manage roles"]);
      this.callRoute('get', "/api/roles/remove/:id", RolesRoutes.remove, ["manage roles"]);

      // Files
      this.callRoute('post', "/api/files/upload", FilesRoutes.uploadFile, ["manage files", "view files"]);
      this.callRoute('get', "/api/files/delete", FilesRoutes.deleteFile, ["manage files", "view files"]);
      this.callRoute('get', "/files/view/:id", FilesRoutes.viewFile, ["view files"]);

      return app;
    }

    callRoute(method, url, func, permission) {
      app[method](url, func);
      Permissions.setPermissions(url, permission);
    }

}
