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
    let ids = [];
    let access = false;
    if (user.hasOwnProperty('roles')) {
      user.roles.map(r => ids.push(r.role));
    }
    RolesRoutes.getPermissionsByID(ids).then(roles => {
      for (let role of roles) {
        role.permissions.map(p => {
          if (permissions.indexOf(p)) {
            access = true;
          }
        });
      }
      if (access) {
        next();
      } else {
        res.status(403).json({
          message: "Erreur, vous n'avez pas les droits requis.",
          success: false
        });
      }
    }, error => {
      res.status(403).json({
        message: "Erreur, vous n'avez pas les droits requis.",
        success: false
      });
    })
  }

  public static sanitizeUrl(url: string): string {
    const url1 = url.indexOf('?') > 0 ? url.substring(0, url.indexOf('?')) : url;
    const url2 = url1.indexOf(':') > 0 ? url1.substring(0, url1.indexOf(':')) : url1;
    const url3 = url2.replace(/\/$/,'');
    return url3;
  }

}
