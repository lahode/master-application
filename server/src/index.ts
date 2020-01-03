import { Request, Response } from 'express';
import * as express from 'express';
import * as http  from 'http';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as socketIo from 'socket.io';

import { RetrieveUser } from "./modules/security/retrieve-user.middleware";
import { APIRoutes }  from "./modules/routes/api.route";
import { starterLog }  from "./modules/common/loggers";
import { CONFIG } from "./config";
import { database } from "./modules/common/database";

export class Server {

  private _app: express.Application;
  private _root: string;
  private _port: number|string|boolean;

  constructor() {
    this._app = express();
    this._app.use(compression());
    this._app.use(RetrieveUser.getUserPayload)
    this.config();
    this.middleware();
    this.defaultServerRoute();
    this._app.use( new APIRoutes().routes());
    database.initDB();
  }

  // Set configuration parameters.
  private config():void {
    // define the app.server endpoints folder.
    this._root = path.join(__dirname, '../api')
    // define prot & normalize value.
    this._port = this.normalizePort(process.env.PORT|| CONFIG.PORT);
    // use the root path defined.
    this._app.use(express.static(this._root))
  }

  // Configure middleware.
  private middleware() {
    // Set cors Options.
    const corsOptions = {
      origin: '*',
      credentials: true,
    }

    this._app
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
    this._app.get('/', starterLog, (req: Request, res: Response) => {
      if (database.check()) {
        res.json({
          code: 200,
          message: `core server works 👌`
        });
      } else {
        res.status(400).send(`database is down :(`);
      }
    });
  }

  // React on errors.
  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind:string = (typeof this._port === 'string') ? 'Pipe ' + this._port : 'Port ' + this._port;
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

  // Bootstrap the application.
  bootstrap():void {
    const httpServer = http.createServer(this._app);
    httpServer.on('error', this.onError);

    // Launch an HTTP Server.
    const server = httpServer.listen(this._port, () => console.log("HTTP Server running at http://localhost:" + this._port));

    // Start socket IO.
    if (server && CONFIG.SOCKET_ACTIVE) {
      this.sockets(server);
    }
  }

  // Initialize SocketIO.
  private sockets(server): void {
    const io = socketIo(server, { serveClient: false });
    io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this._port);
      socket.on('refresh', (m: any) => {
        console.log('[server](refresh): %s', JSON.stringify(m));
        io.emit('refresh', m);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
}
