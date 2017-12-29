import * as express from 'express';
import { sign, verify } from 'jsonwebtoken';
import { CONFIG } from "../../../config";

const nodemailer = require('nodemailer');
const Datastore = require('nedb-promises');
const roleDB = new Datastore(CONFIG.DATABASE.ROLES);
const router = express.Router();

export class RolesRoutes {

  // Get role by ID route
  public static async getRolesByID(ids) {
    let results = [];
    for (let id of ids) {
      let result = await roleDB.findOne({ _id: id })
        .then((role) => {
          if (role) {
            return {data: role, success: true};
          } else {
            return {error: 404, message: "Aucun rôle n'a été trouvé.", success: false};
          }
        })
        .catch((error) => {
          return {error: 500, message: "Une erreur s'est produite lors de la récupération de le rôle.", success: false}
        });
        if (result.hasOwnProperty('data')) {
          results.push(result.data);
        }
    }
    return results;
  }

  // Get role by ID route
  public static get(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    // Find a role by it's ID
    roleDB.findOne({ _id: req.params.id })
      .then((role) => {
        return res.json({role: role, success: true});
      })
      .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la récupération de le rôle.", success: false}));
  }

  // Get all roles route
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
    .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la récupération des rôles.", success: false}));
  }

  // Create role route
  public static create(req, res): void {
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
      return roleDB.insert(role)
        .then((inserted) => {
          if (inserted) {
            return res.json({role: inserted, success: true});
          }
          return res.status(500).json({message: "Une erreur est survenue au moment de la sauvegarde de le rôle", success: false});
        })
        .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de l'insertion de le rôle", success: false}));
    }
    else {
      return res.status(500).json({message: "Impossible d'insérer cet rôle, le rôle existe déjà.", success: false});
    }

  }

  // Save role route
  public static update(req, res): void {
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
      roleDB.findOne({ _id: role._id })
      .then((checkRole) => {
        if (checkRole) {
          return roleDB.update({ _id: role._id }, role)
            .then((updated) => {
              if (updated) {
                return res.json({role: role, success: true});
              }
              return res.status(500).json({message: "Une erreur est survenue au moment de la sauvegarde de le rôle", success: false});
            })
            .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la mise à jour de le rôle.", success: false}));
        } else {
          return res.status(404).json({message: "Impossible de modifier cet rôle, aucun rôle n'a été trouvé.", success: false});
        }
      });
    }
    else {
      return res.status(500).json({message: "Impossible de modifier cet rôle, le rôle n'a pas d'identifiant.", success: false});
    }

  }

  // Delete role route
  public static remove(req, res): void {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    roleDB.findOne({ _id: req.params.id })
    .then((checkRole) => {
      if (checkRole) {
        return roleDB.remove({ _id: req.params.id })
          .then((deleted) => {
            if (!deleted) {
              return res.status(404).json({message: "Aucun rôle n'a été trouvée.", success: false});
            } else {
              return res.json({deleted: req.params.id, success: true});
            }
          })
          .catch((error) => res.status(500).json({message: "Une erreur s'est produite lors de la suppression de le rôle.", success: false}));
      } else {
        return res.status(404).json({message: "Impossible de supprimer cet rôle, aucun rôle n'a été trouvé.", success: false});
      }
    });
  }

}
