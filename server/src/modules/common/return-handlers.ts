import { CONFIG } from "../../config";

var logParams = {
    consoleOutput : false,
    consoleOutputLevel: ['DEBUG','ERROR','WARNING', 'NOTICE'],

    dateTimeFormat: "DD-MM-YYYY HH:mm:ss.S",
    outputPath: "logs/",
    fileNameDateFormat: "DDMMYYYY",
    fileNamePrefix: (CONFIG.LOGNAME || 'log') + "-"
};
var log = require('noogger').init(logParams);

/**
 * Ajoute les messages d'erreurs renvoyés par les schémas
 */
export const returnHandler = (data, defaultMessage = "", err = null) => {
  let errors = defaultMessage || '';

  // Log les message
  if (defaultMessage) {
    log.notice(defaultMessage);
  }

  let success = !(typeof err != 'undefined' && err) ? true : false;
  if (err && typeof(err) === 'object' && 'errors' in err) {
    log.error(err);
    if (process.env.DISPLAY_ERROR == 'true') {
      console.log(err);
    }
    for(let e in err.errors) {
      let error = err.errors[e];
      switch (e) {
        case 'password' :
          if (error.kind == "minlength") {
            errors += `\nLe mot de passe doit comporter au minimum ${err.errors.password.properties.minlength} caractères.\n`;
          }
          else {
            errors += `\nUne erreur s'est produite dans le mot de passe.`;
          }
          break;
        default:
          switch (error.kind) {
            case 'required' :
              errors += `\nLe champ ${e} est requis`;
              break;
            case 'user defined' :
              errors += `\n${error.properties.message}`;
              break;
          }
      }
    }
  }

  return { success: success, data: data, msg: errors };
}
