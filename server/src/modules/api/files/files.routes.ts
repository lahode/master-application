import * as express from 'express';
import * as multer from 'multer';

import { UsersRoutes} from '../users/users.routes';
import { CONFIG } from "../../../config";

const Datastore = require('nedb-promises');
const fileDB = new Datastore(CONFIG.DATABASE.FILES);
const router = express.Router();
const upload = multer({dest: CONFIG.UPLOAD_DIRECTORY}).single('file');

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

}
