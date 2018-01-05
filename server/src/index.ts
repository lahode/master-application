import * as express from 'express';
import * as http  from 'http';
import * as https from 'https';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as morgan from 'morgan';
import * as fs from 'fs-extra';

import { RetrieveUser } from "./modules/security/retrieve-user.middleware";
import { APIRoutes }  from "./modules/routes/api.route";
import { log }  from "./modules/log";
import { CONFIG } from "./config";

export class Server {

  private app:express.Application;
  private server:http.Server;
  private root:string;
  private port:number|string|boolean;

  constructor() {
    this.app = express();
    this.app.use(cookieParser())
    this.app.use(RetrieveUser.getUser)
    this.config();
    this.middleware();
    this.defaultServerRoute();
    this.app.use( new APIRoutes().routes());
  }

  // Set configuration parameters.
  private config():void {
    // define the app.server endpoints folder.
    this.root = path.join(__dirname, '../api')
    // define prot & normalize value.
    this.port = this.normalizePort(process.env.PORT|| CONFIG.PORT);
    // use the root path defined.
    this.app.use(express.static(this.root))
  }

  // Configure middleware.
  private middleware() {
    // Set cors Options.
    const corsOptions = {
      origin: CONFIG.FRONTEND,
      credentials: true,
    }

    this.app
      // use bodyParser middleware to decode json parameters.
      .use(bodyParser.json())
      .use(bodyParser.json({type: 'application/vnd.api+json'}))
      // use bodyParser middleware to decode urlencoded parameters.
      .use(bodyParser.urlencoded({extended: false}))
      // use morgan to log requests to the console.
      .use(morgan('dev'))
      // cors domaine origin.
      .use(cors(corsOptions))
  }

  // Default server route.
  private defaultServerRoute() {
    this.app.get( '/', log, (req, res) => {
      res.json({
        code: 200,
        message: `master-application server work 👌`
      });
    });
  }

  // React on errors.
  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind:string = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
    switch(error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  // Normalize port entry.
  normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
  }

  // Bootstrap the application with HTTPS or HTTP depending if the "--secure" option has been set.
  bootstrap():void {
    if (CONFIG.HTTPS) {
      const httpsServer = https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
      }, this.app);
      httpsServer.on('error', this.onError);

      // Launch an HTTPS Server.
      httpsServer.listen(this.port, () => console.log("HTTPS Secure Server running at https://localhost:" + httpsServer.address().port));
    }
    else {
      const httpServer = http.createServer(this.app);
      httpServer.on('error', this.onError);

      // Launch an HTTP Server.
      httpServer.listen(this.port, () => console.log("HTTP Server running at http://localhost:" + httpServer.address().port));
    }
  }

}
