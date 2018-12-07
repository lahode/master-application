import * as express from 'express';
import { AuthRoutes }  from "../api/auth/auth.routes";
import { UsersRoutes }  from "../api/users/users.routes";
import { RolesRoutes }  from "../api/roles/roles.routes";
import { FilesRoutes }  from "../api/files/files.routes";
import { NotificationRoutes }  from "../api/notification/notification.routes";
import { Permissions } from "../permissions";

import { checkIfAuthenticated } from "../security/authentication.middleware";

const app = express();

export class APIRoutes {

  routes() {
    // Authentication
    app.post("/api/login", AuthRoutes.loginRoute);
    app.post("/api/signup", AuthRoutes.signUpRoute);
    app.post("/api/retrieve-password", AuthRoutes.sendPswRoute);
    app.post("/api/init-password", AuthRoutes.initPswRoute);
    app.use("/api/secure", checkIfAuthenticated);
    app.post("/api/secure/logout", AuthRoutes.logoutRoute);
    app.get("/api/secure/check-auth", AuthRoutes.checkAuth);

    // Permission
    app.post("/api/secure/check-permissions", RolesRoutes.checkPermissions);
    app.use("/api/secure", Permissions.permissionOnRoute);

    // Users
    this.callRoute('get', "/api/secure/users/list/:offset/:limit/:sort?/:field?/:value?", UsersRoutes.list);
    this.callRoute('get', "/api/secure/users/all", UsersRoutes.all);
    this.callRoute('get', "/api/secure/users/get/:id", UsersRoutes.get, ["view users"]);
    this.callRoute('post', "/api/secure/users/create", UsersRoutes.create, ["manage users"]);
    this.callRoute('post', "/api/secure/users/update", UsersRoutes.update, ["manage users"]);
    this.callRoute('get', "/api/secure/users/remove/:id", UsersRoutes.remove, ["manage users"]);

    // profile
    this.callRoute('get', "/api/secure/profile/get", UsersRoutes.getProfile);
    this.callRoute('post', "/api/secure/profile/update", UsersRoutes.updateProfile);

    // Roles
    this.callRoute('get', "/api/secure/roles/list", RolesRoutes.list);
    this.callRoute('get', "/api/secure/roles/get-permissions", RolesRoutes.getPermissions, ["manage roles"]);
    this.callRoute('get', "/api/secure/roles/get/:id", RolesRoutes.get, ["manage roles"]);
    this.callRoute('post', "/api/secure/roles/create", RolesRoutes.create, ["manage roles"]);
    this.callRoute('post', "/api/secure/roles/update", RolesRoutes.update, ["manage roles"]);
    this.callRoute('get', "/api/secure/roles/remove/:id", RolesRoutes.remove, ["manage roles"]);

    // Files
    this.callRoute('post', "/api/secure/files/upload", FilesRoutes.uploadFile);
    this.callRoute('get', "/api/secure/files/delete/:id", FilesRoutes.deleteFile, ["manage files"]);
    this.callRoute('get', "/api/secure/files/view/:id", FilesRoutes.viewFile);

    // Notification
    this.callRoute('post', "/api/secure/notification/emails", NotificationRoutes.emails);
    this.callRoute('post', "/api/secure/notification/users", NotificationRoutes.users);

    return app;
  }

  callRoute(method, url, func, permission = []) {
    app[method](url, func);
    Permissions.setPermissions(url, permission);
  }

}
