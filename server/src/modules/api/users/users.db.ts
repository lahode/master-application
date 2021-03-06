import * as mongoose from 'mongoose';
import * as validator from 'validator';

/**
 * Init variables.
 */
var Schema = mongoose.Schema;

export const DEFAULT_ICON = `data:image/png;base64,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`;

/**
 Schéma de l'utilisateur
 */
export const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  firstname: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  title: {
    type: String
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: validator.isEmail,
    message: 'L\'e-mail{VALUE} n\'est pas valide',
  },
  password: {
    type: String,
  },
  sub: {
    type: String,
  },
  roles: [{
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    }
  }],
  picture: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
  icon: {
    type: String,
    default: DEFAULT_ICON
  },
  phone: {
    type: String
  },
  language: {
    type: String
  },
  emailNotify: {
    type: Boolean,
    default: true
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
 * Export le modèle de l'utilisateur
 */
export const userDB = mongoose.model('User', userSchema);
