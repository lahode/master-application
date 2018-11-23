import { Request, Response } from 'express';

import { Permissions } from "../../permissions";
import { UsersRoutes } from "../users/users.routes";
import { returnHandler } from '../../common/return-handlers';

import { roleDB } from './roles.db';

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
        if (role.permissions && role.permissions.length > 0) {
          role.permissions.map((permission) => {
            if (results.indexOf(permission) === -1) {
              results.push(permission);
            }
          });
        }
      }
      return {data: results, success: true}; ;
    }
    catch(e) {
      return {error: 500, message: "Une erreur s'est produite lors de la récupération de le rôle.", success: false};
    }
  }

  // Check permissions route.
  public static async checkPermissions(req: Request, res: Response) {
    // Check if permissions has been set
    if (!Array.isArray(req.body)) {
      return res.json( returnHandler( {} ) );
    }
    const data = await UsersRoutes.findUserBySub(req['user']);
    if (data.success) {
      Permissions.checkPermissionOnUser(data.user, req.body).then(check => {
        return res.json( returnHandler( {} ) );
      })
      .catch(e => {
        res.status(405).json( returnHandler(null, "Vous n'êtes pas autorisé à accéder.", e) );
      });
    }
    else {
      res.status(data.error).json( returnHandler(null, data.message) );
    }
  }

  // Get all permissions.
  public static getPermissions(req: Request, res: Response) {
    return res.json( returnHandler( { permissions: Permissions.permissionsList} ) );
  }

  // Get role by ID route route.
  public static get(req, res) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    // Find a role by it's ID
    roleDB.findOne({ _id: req.params.id })
      .then((role) => {
        return res.json( returnHandler( {role: role} ) );
      })
      .catch(e => res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération de le rôle.", e) ) );
  }

  // Get all roles route.
  public static list(req: Request, res: Response): void {
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
        return res.json( returnHandler( {roles: results, total: roles.length } ) );
      } else {
        return res.status(404).json( returnHandler(null, "Aucun rôle n'a été trouvée." ) );
      }
    })
    .catch(e => res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération des rôles.", e) ));
  }

  // Create role route
  public static async create(req: Request, res: Response) {
    if (!req.body.name) {
      return res.status(400).json( returnHandler(null, "Un rôle doit avoir au moins un nom.") );
    }
    let role = Object.assign({}, req.body);

    // Check if ID exists
    if (!role._id) {
      try {
        // Set the user owner.
        const data = await UsersRoutes.findUserBySub(req['user']);
        role.owner = data.user._id;

        // Insert role to the database.
        const insertedRole = await roleDB.create(role);
        return res.json( returnHandler( {role: insertedRole} ) );
      }
      catch (e) {
        return res.status(500).json( returnHandler(null, "Une erreur est survenue au moment de la sauvegarde de le rôle", e) );
      }
    }
    else {
      return res.status(500).json( returnHandler(null, "Impossible d'insérer cet rôle, le rôle existe déjà.") );
    }

  }

  // Save role route
  public static async update(req: Request, res: Response) {
    if (!req.body.name) {
      return res.status(400).json( returnHandler(null, "Un rôle doit avoir au moins un nom.") );
    }
    let role = Object.assign({}, req.body);

    // Manage the update
    if (role._id) {
      if (role.owner) {
        if (typeof role.owner !== 'string') {
          role.owner = role.owner._id;
        }
      } else {
        role.owner = role._id;
      }
      role.updated = new Date().toISOString();
      try {
        // Find role in the database.
        const checkRole = await roleDB.findOne({ _id: role._id });
        if (checkRole) {
          // Update role to the database.
          const updated = await roleDB.update({ _id: role._id }, role);
          return res.json( returnHandler( {role: role} ) );
        } else {
          return res.status(404).json( returnHandler(null, "Impossible de modifier cet rôle, aucun rôle n'a été trouvé.") );
        }
      }
      catch (e) {
        return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la mise à jour de le rôle.", e) );
      }
    }
    else {
      return res.status(500).json( returnHandler(null, "Impossible de modifier cet rôle, le rôle n'a pas d'identifiant.") );
    }

  }

  // Delete role route
  public static async remove(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }

    try {
      // Find role in the database.
      const checkRole = await roleDB.findOne({ _id: req.params.id });
      if (checkRole) {

        // Delete the role in the database.
        const deletedRole = await roleDB.remove({ _id: req.params.id });
        return res.json( returnHandler( {deleted: req.params.id} ) );
      } else {
        return res.status(404).json( returnHandler(null, "Impossible de supprimer cet rôle, aucun rôle n'a été trouvé.") );
      }
    }
    catch (e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la suppression de le rôle.", e) );
    }

  }

}
