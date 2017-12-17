import * as express from 'express';
import * as http  from 'http';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as morgan from 'morgan';

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
    this.server = http.createServer(this.app);
    this.config();
    this.middleware();
    this.defaultServerRoute();
    this.app.use( new APIRoutes().routes());
  }

  // Set configuration parameters
  private config():void {
    // define the app.server endpoints folder
    this.root = path.join(__dirname, '../api')
    // define prot & normalize value
    this.port = this.normalizePort(process.env.PORT|| CONFIG.PORT);
    // use the root path defined
    this.app.use(express.static(this.root))
  }

  // Configure middleware
  private middleware() {
    this.app
      // use bodyParser middleware to decode json parameters
      .use(bodyParser.json())
      .use(bodyParser.json({type: 'application/vnd.api+json'}))
      // use bodyParser middleware to decode urlencoded parameters
      .use(bodyParser.urlencoded({extended: false}))
      // secret variable for jwt
      .set('superSecret', CONFIG.SECRET_TOKEN_KEY)
      // use morgan to log requests to the console
      .use(morgan('dev'))
      // cors domaine origin
      .use(cors())
  }

  // Default server route
  private defaultServerRoute() {
    this.app.get( '/', log, (req, res) => {
      res.json({
        code: 200,
        message: `master-application server work 👌`
      });
    });
  }

  // React on errors
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

  // Normalize port entry
  normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
  }

  // Bootstrap the application
  bootstrap():void {
    this.server.on('error', this.onError);
    this.server.listen(this.port, ()=>{
    	console.log("Listnening on port " + this.port)
    });
  }

}
