import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs-extra';

import { UsersRoutes} from '../users/users.routes';
import { CONFIG } from "../../../config";

const Datastore = require('nedb-promises');
const fileDB = new Datastore(CONFIG.DATABASE.FILES);
const router = express.Router();
const upload = multer({dest: CONFIG.UPLOAD_DIRECTORY}).single('file');
const uploads = multer({dest: CONFIG.UPLOAD_DIRECTORY}).array('files');

export class FilesRoutes {

  // Upload a single file, save it into file database and return the new entry
  public static uploadFile(req, res): void {
    upload(req, res, function (err) {
      if (err || !req.file) {
        return res.status(500).json({message: "Une erreur s'est produit lors de l'upload du fichier", success: false});
      }
      return fileDB.insert(req.file)
        .then((inserted) => {
          return res.json({file: inserted._id, success: true});
        })
        .catch(() => res.status(500).json({message: "Une erreur s'est produit lors de la sauvegarde du fichier dans la base de données", success: false}));
    });
  }

  // View a file by its ID
  public static viewFile(req, res): void {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    // Find a course by it's ID
    fileDB.findOne({ _id: req.params.id })
      .then((file) => {
        if (file) {
          const filePath =  file.path;
          let fileToLoad = fs.readFileSync(filePath);
          res.writeHead(200, {'Content-Type' : file.mimetype});
          res.end(fileToLoad);
        } else {
          return res.status(404).json({message: "Aucune fichier n'a été trouvé.", success: false});
        }
      });
  }

  // Delete a file
  public static deleteFile(req, res): void {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    // Find a course by it's ID
    FilesRoutes.removeFile(req.params.id)
      .then((file) => {
        return res.json(file);
      })
      .catch((error) => res.status(error.status).json({message: error.message, success: false}));
  }

  // Remove a file from upload directory and remove them from the database
  public static async removeFile(fileID) {
    // Check if file is present in the database
    return fileDB.findOne({ _id: fileID })
      .then((file) => {
        // Remove the file in the database
        return fileDB.remove({ _id: file._id })
          .then(() => {
            // Delete the file in the upload directory
            return fs.remove()
              .then(() => {
                return {message: "Le fichier a été supprimé.", success: true};
              })
              .catch(() => {
                return Promise.reject({message: "Une erreur est survenue lors de la suppression du fichier.", status: 500})
              });
          })
          .catch(() => Promise.reject({message: "Une erreur est survenue lors de la suppression du fichier dans la base de données.", status: 500}));
      })
      .catch(() => Promise.reject({message: "Aucune fichier n'a été trouvé.", status: 404}));
  }

}
