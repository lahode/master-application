import { Request } from 'express';
import * as proxy from 'http-proxy-middleware';

export class AppProxy {

  // Redirect proxy.
  public static redirect(url = null) {
    return proxy({
      target: 'http://localhost',
      changeOrigin: true,
      router: ((req: Request) => url || req['appURL'])
    })
  }
}
