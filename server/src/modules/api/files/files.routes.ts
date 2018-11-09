import * as multer from 'multer';
import * as fs from 'fs-extra';

import { CONFIG } from "../../../config";

const Datastore = require('nedb-promises');
const fileDB = new Datastore(CONFIG.DATABASE.FILES);
const upload = multer({dest: CONFIG.UPLOAD_DIRECTORY}).single('file');
const uploads = multer({dest: CONFIG.UPLOAD_DIRECTORY}).array('files');

export class FilesRoutes {

  // Upload a single file, save it into file database and return the new entry
  public static uploadFile(req, res): void {
    upload(req, res, (err) => {
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
  public static async viewFile(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
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
        return res.status(404).json({message: "Aucune fichier n'a été trouvé.", success: false});
      }
    }
    catch(e) {
      return res.status(500).json({message: "Une erreur s'est produite lors de la récupération du fichier.", success: false});
    }
  }

  // Delete a file
  public static async deleteFile(req, res) {
    if (!req.params.id) {
      return res.status(400).json({message: "Aucun ID n'a été trouvé dans la requête.", success: false});
    }
    try {
      const fileDeleted = await FilesRoutes.removeFile(req.params.id);
      return res.json(fileDeleted);
    }
    catch(error) {
      return res.status(error.status).json({message: error.message, success: false});
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
