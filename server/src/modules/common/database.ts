import * as mongoose from 'mongoose';
import { CONFIG } from "../../config";

export const database = {
  connect() {
    console.log(CONFIG.MONGODB)
    mongoose.connect(CONFIG.MONGODB, { useNewUrlParser: true, autoIndex: false }, (err: any) => {
      if (err) {
        console.log(err.message);
        console.log(err);
      }
      else {
        console.log('Connected to MongoDb');
      }
    });
  }
}
