import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

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
          return res.json({file: inserted, success: true});
        })
        .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la sauvegarde du fichier dans la base de données", success: false}));
    });
  }

  // Upload a multiple files, save them into file database and return the new entries
  public static uploadFiles(req, res): void {
    uploads(req, res, function (err) {
      console.log(req.files);
      if (err || !req.files) {
        return res.status(500).json({message: "Une erreur s'est produit lors de l'upload du fichier", success: false});
      }
      return res.json({files: req.files, success: true});
      /*
      return fileDB.insert(req.files)
        .then((inserted) => {
          return res.json({file: inserted, success: true});
        })
        .catch((error) => res.status(500).json({message: "Une erreur s'est produit lors de la sauvegarde du fichier dans la base de données", success: false}));
      */
    });
  }

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

}
