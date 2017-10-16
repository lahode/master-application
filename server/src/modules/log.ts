export const log = (req,res,next) => {
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log("Query route path-> ", req.route.path);
  console.log("Query route params-> ", req.params);
  console.log("Query route methode-> ", req.route.methods);
	next();
}
