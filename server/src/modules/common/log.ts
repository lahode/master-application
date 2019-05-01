import { Request, Response } from 'express';

export const log = (req: Request, res: Response, next: any) => {
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("Query route path-> ", req.route.path);
  console.log("Query route params-> ", req.params);
  console.log("Query route methode-> ", req.route.methods);
	next();
}
