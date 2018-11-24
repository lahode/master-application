import { RolesRoutes } from "./api/roles/roles.routes";
import { UsersRoutes } from "./api/users/users.routes";
import { returnHandler } from './common/return-handlers';

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
  public static async permissionOnRoute(req, res, next) {
    const url = Permissions.sanitizeUrl(req.originalUrl) || '';
    const permissions = Permissions.findPermissionOnUrl(url) || [];
    const data = await UsersRoutes.findUserBySub(req['user']);
    if (data.success) {
      Permissions.checkPermissionOnUser(data.user, permissions).then(check => {
        next();
      })
      .catch(e => {
        return res.status(403).json( returnHandler(null, "Erreur, vous n'avez pas les droits requis.", e) );
      });
    }
    else {
      return res.status(data.error).json( returnHandler(null, data.message) );
    }
  }

  // Find permission on url.
  public static findPermissionOnUrl(url) {
    let result = '';
    Permissions.permissions.forEach((value, key, map) => {
      if (url.includes(key)) {
        result = value;
      }
    });
    return result;
  }

  // Check if a user has permissions to get further
  public static async checkPermissionOnUser(user, permissions) {
    // If no permissions need to be checked, allow user to continue.
    if (!permissions || permissions.length === 0) {
      return true;
    }
    try {
      // Check for each roles the user have, if the permissions match with the one needed.
      const permissionsOnUser = await RolesRoutes.findPermission(user);
      if (permissionsOnUser.success) {
        for (let permissionUser of permissionsOnUser.data) {
          if (permissions.includes(permissionUser)) {
            return true;
          }
        }
      }
      throw false;
    }
    catch(e) {
      throw false;
    }
  }

  public static sanitizeUrl(url: string): string {
    const url1 = url.indexOf('?') > 0 ? url.substring(0, url.indexOf('?')) : url;
    const url2 = url1.indexOf(':') > 0 ? url1.substring(0, url1.indexOf(':')) : url1;
    const url3 = url2.replace(/\/$/,'');
    return url3;
  }

}
