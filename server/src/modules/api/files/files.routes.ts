import { Request, Response } from 'express';
import * as multer from 'multer';
import * as fs from 'fs-extra';
import * as filenamify  from 'filenamify';
import { promisify } from 'util';
import { ObjectID } from 'mongodb';
import { UsersRoutes } from "../users/users.routes";

import { CONFIG } from "../../../config";
import { returnHandler } from '../../common/return-handlers';
import { fileDB } from './files.db';

export class FilesRoutes {

  // Upload a single file, save it into file database and return the new entry
  public static async uploadFile(req: Request, res: Response) {
    try {

      // Récupère l'utilisateur courant.
      const data = await UsersRoutes.findUserBySub(req['user']);
      const userID = (data.success) ? data.user._id : null;

      // Sauvegarde le flux uploadé.
      let uploadedFolder = '';
      if (req.params.folder) {
        const folderArray = req.params.folder.split('-');
        uploadedFolder = '/'  + folderArray.join('/');
      }
      const upload = promisify(multer({dest: `${CONFIG.UPLOAD_DIRECTORY}${uploadedFolder}`}).single('file'));
      await upload(req, res);

      // Insert les informations du fichier dans la base de données.
      const file = req['file'];
      file['path'] = uploadedFolder + '/' + file.filename;
      file['destination'] = uploadedFolder;
      file['user'] = userID;
      file['originalname'] = filenamify(file.originalname);
      const fileInserted = await fileDB.create(file);
      return res.json( returnHandler( {file: fileInserted._id, success: true} ) );
    } catch(e) {
      return res.status(500).json( returnHandler(null, "Une erreur s'est produit lors de la sauvegarde du fichier dans la base de données", e) );
    }
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
        // Check if file exists in path.
        const path = `${CONFIG.UPLOAD_DIRECTORY}${file.path}`;
        if (!fs.existsSync(path)) {
          return res.status(404).json( returnHandler(null, `Aucun fichier n'a été trouvé dans ${path}.`) );
        }

        res.setHeader('Content-disposition', 'attachment; filename=' + file.originalname);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader('Content-type', file.mimetype);

        const filestream = fs.createReadStream(`${CONFIG.UPLOAD_DIRECTORY}${file.path}`);
        filestream.pipe(res).on('error', (error: Error) => {process.exit(-1);throw(error);});
        return true;
      } else {
        return res.status(404).json( returnHandler(null, "Aucun fichier correspondant n'a été trouvé dans la base de données.") );
      }
    }
    catch(e) {
      return res.status(500).json( returnHandler(e, "Une erreur s'est produite lors de la récupération du fichier.", e) );
    }
  }

  // Delete a file.
  public static async deleteFile(req: Request, res: Response) {
    if (!req.params.id) {
      return res.status(400).json( returnHandler(null, "Aucun ID n'a été trouvé dans la requête.") );
    }
    try {
      const fileDeleted = await FilesRoutes.removeFiles({ _id: req.params.id });
      return res.json( returnHandler( fileDeleted ) );
    }
    catch(e) {
      return res.status(e.status).json( returnHandler(null, e.message, e) );
    }
  }

  // Clean the non-active files of a user.
  public static async cleanTempFiles(req: Request, res: Response) {
    try {
      // Récupère l'utilisateur courant.
      const data = await UsersRoutes.findUserBySub(req['user']);
      const userID = (data.success) ? data.user._id : null;

      if (userID) {
        const filesDeleted = await FilesRoutes.removeFiles({ user: userID, active: false });
        return res.json( returnHandler( filesDeleted ) );
      }
      return res.status(400).json( returnHandler(null, "Un problème est survenu dans le nettoyage des fichiers temporaires") );
    }
    catch(e) {
      return res.status(e.status).json( returnHandler(null, e.message, e) );
    }
  }

  // Remove one or several files from upload directory and from the database according to the query.
  public static async removeFiles(query: any) {
    try {
      // Check if file is present in the database
      const files = await fileDB.find(query);

      for (const file of files) {
        // Remove the file in the database
        await fileDB.deleteOne({ _id: ObjectID(file._id) });
        // Delete the file in the upload directory
        await fs.remove(`${CONFIG.UPLOAD_DIRECTORY}${file.path}`);
      }
      // Return a confirmation.
      const message = files.length > 1 ? "Le fichier a été supprimé." : files.length === 1 ? "Le fichier a été supprimé." : "Aucun fichier n'a pu être supprimé";
      return {message, success: true};
    }
    catch(e) {
      return Promise.reject(e);
    }
  }

  // Set file as permanent.
  public static async setPermanent(fileID: any) {
    try {
      // Update the file to set it as active.
      await fileDB.updateOne({_id: fileID}, { active: true });

      // Return a confirmation.
      return {success: true};
    }
    catch(e) {
      return Promise.reject(e);
    }
  }

}
