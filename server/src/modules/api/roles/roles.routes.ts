import { CONFIG } from "../../../config";
import { Permissions } from "../../permissions";
import { UsersRoutes } from "../users/users.routes";

const Datastore = require('nedb-promises');
const roleDB = new Datastore(CONFIG.DATABASE.ROLES);

export class RolesRoutes {

  // Get permissions by IDs.
  public static async getPermissionsByID(roles) {
    let results = [];
    try {
      for (let id of roles) {
        // Get each role in the database.
        const role = await roleDB.findOne({ _id: id });
        if (!role) {
          return {error: 404, message: "Aucun rôle n'a été trouvé.", success: false};
        }

        // Retrieve each permission on each role.
        if (role.hasOwnProperty('permissions')) {
          role.permissions.map((permission) => {
            if (results.indexOf(permission) === -1) {
              results.push(permission);
            }
          });
        }
      }
    }
    catch(e) {
      return {error: 500, message: "Une erreur s'est produite lors de la récupération de le rôle.", success: false};
    }
    return {data: results, success: true}; ;
  }

  // Check permissions route.
  public static async checkPermissions(req, res) {
    // Check if permissions has been set
    if (!Array.isArray(req.body)) {
      return res.json({success: true});
    }
    const data = await UsersRoutes.findUserBySub(req['user']);
    if (data.success) {
      Permissions.checkPermissionOnUser(data.user, req.body).then(check => {
        return res.json({success: true});
      })
      .catch(error => {
        res.status(405).json({
          message: "Vous n'êtes pas autorisé à accéder.",
          success: false
        });
      });
    }
    else {
      res.status(data.error).json({message: data.message, success: data.success});
    }
  }

  // Get all permissions.
  public static getPermissions(req, res) {
    return res.json({permissions: Permissions.permissionsList, success: true});
  }

  // Get role by ID route route.
  public static get(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    // Find a role by it's ID
    roleDB.findOne({ _id: req.params.id })
      .then((role) => {
        return res.json({role: role, success: true});
      })
      .catch(error => res.status(500).json({message: "Une erreur s'est produite lors de la récupération de le rôle.", success: false}));
  }

  // Get all roles route.
  public static list(req, res): void {
    // Find all roles
    roleDB.find({}, {name: 1, active: 1})
    .sort({title: 1})
    .then((roles) => {
      if (roles) {
        let results = [];
        // Loop on each roles and limit of "from" and "to" parameters have been set
        roles.map((roles, index) => {
          if (req.params.from && req.params.to) {
            if (index >= parseInt(req.params.from) && index <= parseInt(req.params.to)) {
              results.push(roles);
            }
          }
          else {
            results.push(roles);
          }
        });
        return res.json({roles: results, total: roles.length, success: true});
      } else {
        return res.status(404).json({message: "Aucun rôle n'a été trouvée.", success: false});
      }
    })
    .catch(error => res.status(500).json({message: "Une erreur s'est produite lors de la récupération des rôles.", success: false}));
  }

  // Create role route
  public static async create(req, res) {
    if (!req.body.name) {
      return res.status(400).json({message: "Un rôle doit avoir au moins un nom.", success: false});
    }
    let role = Object.assign({}, req.body);

    // Check if ID exists
    if (!role._id) {
      if (typeof role.owner !== 'string') {
        role.owner = role.owner._id;
      }
      role.created = new Date().toISOString();
      role.updated = new Date().toISOString();
      role.active = true;

      try {
        // Insert role to the database.
        const insertedRole = await roleDB.insert(role);
        return res.json({role: insertedRole, success: true});
      }
      catch (e) {
        return res.status(500).json({message: "Une erreur est survenue au moment de la sauvegarde de le rôle", success: false});
      }
    }
    else {
      return res.status(500).json({message: "Impossible d'insérer cet rôle, le rôle existe déjà.", success: false});
    }

  }

  // Save role route
  public static async update(req, res) {
    if (!req.body.name) {
      return res.status(400).json({message: "Un rôle doit avoir au moins un nom.", success: false});
    }
    let role = Object.assign({}, req.body);

    // Manage the update
    if (role._id) {
      if (typeof role.owner !== 'string') {
        role.owner = role.owner._id;
      }
      role.updated = new Date().toISOString();
      try {
        // Find role in the database.
        const checkRole = await roleDB.findOne({ _id: role._id });
        if (checkRole) {
          // Update role to the database.
          const updated = await roleDB.update({ _id: role._id }, role);
          return res.json({role: role, success: true});
        } else {
          return res.status(404).json({message: "Impossible de modifier cet rôle, aucun rôle n'a été trouvé.", success: false});
        }
      }
      catch (e) {
        return res.status(500).json({message: "Une erreur s'est produite lors de la mise à jour de le rôle.", success: false});
      }
    }
    else {
      return res.status(500).json({message: "Impossible de modifier cet rôle, le rôle n'a pas d'identifiant.", success: false});
    }

  }

  // Delete role route
  public static async remove(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }

    try {
      // Find role in the database.
      const checkRole = await roleDB.findOne({ _id: req.params.id });
      if (checkRole) {

        // Delete the role in the database.
        const deletedRole = await roleDB.remove({ _id: req.params.id });
        return res.json({deleted: req.params.id, success: true});
      } else {
        return res.status(404).json({message: "Impossible de supprimer cet rôle, aucun rôle n'a été trouvé.", success: false});
      }
    }
    catch (e) {
      return res.status(500).json({message: "Une erreur s'est produite lors de la suppression de le rôle.", success: false});
    }

  }

}
