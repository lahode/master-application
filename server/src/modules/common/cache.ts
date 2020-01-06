import { Request, Response, NextFunction } from 'express';
import * as redis from 'redis';
import { promisify } from 'util';

import { CONFIG } from "../../config";
import { nooggerLog } from './loggers';

const redisClient = CONFIG.REDIS.active ? redis.createClient(CONFIG.REDIS.port, CONFIG.REDIS.host) : null;
const getAsync = redisClient ? promisify(redisClient.get).bind(redisClient) : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    nooggerLog.error("Error REDIS - " + err);
  });
}

export class AppCache {

  // Set App URL to Redis user:appkey key.
  public static setAppURL(userSub: string, appID: string) {
    if (redisClient) {
      redisClient.set(`user-appkey-${CONFIG.PORT}:${userSub}`, appID);
    }
  }

  // Get App URL from Redis user:appkey key and set it to the request.
  public static async getAppURL(req: Request, res: Response, next: NextFunction) {
    if (req['user'] && redisClient) {
      const userSub = req['user'].sub;
      const appURL = await getAsync(`user-appkey-${CONFIG.PORT}:${userSub}`);
      req['appURL'] = appURL;
    }
    next();
  }

  // Set App URL to Redis user:appkey key.
  public static setUser(userSub: string, user: any) {
    if (redisClient) {
      const userStringified = JSON.stringify(user);
      redisClient.set(`user-detail-${CONFIG.PORT}:${userSub}`, userStringified);
    }
  }

  // Get the user from Redis cache.
  public static async getUserFromCache(user) {
    let userStringified = null;
    if (redisClient) {
      const userSub = user.sub;
      userStringified = await getAsync(`user-detail-${CONFIG.CORE ? CONFIG.CORE.port : CONFIG.port}:${userSub}`);
    }
    return JSON.parse(userStringified);
  }

  // Get App URL from Redis user:appkey key and set it to the request.
  public static async getUser(req: Request, res: Response, next: NextFunction) {
    if (req['user'] && redisClient) {
      const userSub = req['user'].sub;
      const userStringified = await getAsync(`user-detail-${CONFIG.PORT}:${userSub}`);
      req['userDetail'] = JSON.parse(userStringified);
    }
    next();
  }

}
