import { RolesRoutes } from "./api/roles/roles.routes";

// Export the permissions class
export class Permissions {

  public static permissions = new Map();
  public static permissionsList: string[] = [];

  public static setPermissions(url: string, permissions: string[]) {
    Permissions.permissions.set(Permissions.sanitizeUrl(url), permissions);
    permissions.map(perm => {
      if (Permissions.permissionsList.indexOf(perm) === -1) {
        Permissions.permissionsList.push(perm);
      }
    });
  }

  // Check permission on each route
  public static permissionOnRoute(req, res, next): void {
    const url = Permissions.sanitizeUrl(req.originalUrl) || '';
    const permissions = Permissions.permissions.get(url) || [];
    const user = req.isAuth.user || {};
    Permissions.checkPermissionOnUser(user, permissions).then(check => {
      next();
    })
    .catch(error => {
      res.status(403).json({
        message: "Erreur, vous n'avez pas les droits requis.",
        success: false
      });
    })
  }

  // Check if a user has permissions to get further
  public static async checkPermissionOnUser(user, permissions) {
    let roleIds = [];
    let access = false;
    if (user.hasOwnProperty('roles')) {
      user.roles.map(r => roleIds.push(r.role));
    }
    return await RolesRoutes.getPermissionsByID(roleIds).then(roles => {
      for (let role of roles) {
        role.permissions.map(p => {
          if (permissions.indexOf(p)) {
            access = true;
          }
        });
      }
      if (access) {
        return true;
      } else {
        throw false;
      }
    })
    .catch(error => Promise.reject(false));
  }

  public static sanitizeUrl(url: string): string {
    const url1 = url.indexOf('?') > 0 ? url.substring(0, url.indexOf('?')) : url;
    const url2 = url1.indexOf(':') > 0 ? url1.substring(0, url1.indexOf(':')) : url1;
    const url3 = url2.replace(/\/$/,'');
    return url3;
  }

}
