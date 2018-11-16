import { Request, Response } from 'express';
import * as multer from 'multer';
import * as fs from 'fs-extra';

import { CONFIG } from "../../../config";
import { returnHandler } from '../../common/return-handlers';

const Datastore = require('nedb-promises');
const fileDB = new Datastore(CONFIG.DATABASE.FILES);
const upload = multer({dest: CONFIG.UPLOAD_DIRECTORY}).single('file');
const uploads = multer({dest: CONFIG.UPLOAD_DIRECTORY}).array('files');

export class FilesRoutes {

  // Upload a single file, save it into file database and return the new entry
  public static uploadFile(req: Request, res: Response): void {
    upload(req, res, (err) => {
      if (err || !req['file']) {
        return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de l'upload du fichier") );
      }
      return fileDB.insert(req['file'])
        .then((inserted) => {
          return res.json( returnHandler( {file: inserted._id} ) );
        })
        .catch((e) => res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la sauvegarde du fichier dans la base de données", e) ) );
    });
  }

  // View a file by its ID
  public static async viewFile(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    try {
      // Find the file in the database.
      const file = await fileDB.findOne({ _id: req.params.id });
      if (file) {
        const filePath = file.path;
        let fileToLoad = fs.readFileSync(filePath);
        res.writeHead(200, {'Content-Type' : file.mimetype});
        return res.end(fileToLoad);
      } else {
        return res.status(404).json( returnHandler(null, "Aucune fichier n'a été trouvé.") );
      }
    }
    catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produite lors de la récupération du fichier.", e) );
    }
  }

  // Delete a file
  public static async deleteFile(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    try {
      const fileDeleted = await FilesRoutes.removeFile(req.params.id);
      return res.json( returnHandler( fileDeleted ) );
    }
    catch(e) {
      return res.status(e.status).json( returnHandler(null, e.message, e) );
    }
  }

  // Remove a file from upload directory and remove them from the database
  public static async removeFile(fileID) {
    try {
      // Check if file is present in the database
      const file = await fileDB.findOne({ _id: fileID });
      // Remove the file in the database
      const fileRemoved = await fileDB.remove({ _id: file._id });
      // Delete the file in the upload directory
      const fileDeleted = await fs.remove(file.filename);
      // Return a confirmation.
      return {message: "Le fichier a été supprimé.", success: true};
    }
    catch(e) {
      return Promise.reject({message: "Une erreur est survenue lors de la suppression du fichier.", status: 500});
    }
  }

}
