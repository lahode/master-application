import { Request, Response } from 'express';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, errors, json } = format;

import { CONFIG } from "../../config";

// Define starter logger;
export const starterLog = (req: Request, res: Response, next: any) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("Query route path-> ", req.route.path);
  console.log("Query route params-> ", req.params);
  console.log("Query route methode-> ", req.route.methods);
  next();
};

// Define noogger logging;
const nooggerParams = {
  consoleOutput : false,
  consoleOutputLevel: ['DEBUG','ERROR','WARNING', 'NOTICE'],

  dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
  outputPath: "logs/",
  fileNameDateFormat: "YYYYMMDD",
  fileNamePrefix: (CONFIG.LOGNAME || 'log') + "-DEFAULT-"
};

export const nooggerLog = require('noogger').init(nooggerParams);

// Define winston logging;
const transport = new (DailyRotateFile)({
  dirname: 'logs/',
  filename: `${CONFIG.LOGNAME}-ERROR-%DATE%.log`,
  datePattern: 'YYYYMMDD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d'
});

export const winstonLog = createLogger({
  format: combine(
    errors({ stack: true }),
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss'
    }),
    json()
  ),
  transports: [
    transport
  ]
});
