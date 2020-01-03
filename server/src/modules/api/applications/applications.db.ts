import * as mongoose from 'mongoose';
import * as validator from 'validator';

/**
 * Init variables.
 */
var Schema = mongoose.Schema;
/**
 Schéma de l'application
 */
export const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

/**
 * Export le modèle de l'application
 */
export const appDB = mongoose.model('Application', appSchema);
