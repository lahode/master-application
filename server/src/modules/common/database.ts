import * as mongoose from 'mongoose';

import { CONFIG } from "../../config";

const RETRY_TIMEOUT = 3000

export const database = {
  initDB () {
    mongoose.Promise = global.Promise
    const options = {
      autoReconnect: true,
      autoIndex: false,
      useCreateIndex: true,
      useNewUrlParser: true,
      keepAlive: 30000,
      reconnectInterval: RETRY_TIMEOUT,
      reconnectTries: 10000,
      useFindAndModify: false
    }

    let isConnectedBefore = false

    const connect = function () {
      return mongoose.connect(CONFIG.MONGODB, options)
        .catch(err => console.error('Mongoose connect(...) failed with err: ', err))
    }

    connect()

    mongoose.connection.on('error', function () {
      console.error('Could not connect to MongoDB')
    })

    mongoose.connection.on('disconnected', function () {
      console.error('Lost MongoDB connection...')
      if (!isConnectedBefore) {
        setTimeout(() => connect(), RETRY_TIMEOUT)
      }
    })
    mongoose.connection.on('connected', function () {
      isConnectedBefore = true
      console.info('Connection established to MongoDB')
    })

    mongoose.connection.on('reconnected', function () {
      console.info('Reconnected to MongoDB')
    })

    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.warn('Force to close the MongoDB connection after SIGINT')
        process.exit(0)
      })
    })
  },
  check() {
    return mongoose.connection.readyState;
  }
}
