import * as mongoose from 'mongoose';

/**
 * Init variables.
 */
var Schema = mongoose.Schema;

/**
 File schema.
 */
const fileSchema = new Schema({
  fieldname: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  encoding: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  destination: {
    type: String
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
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
    default: false
  }
})
.index({ student: 1 });

/**
 * Export the file model.
 */
export const fileDB = mongoose.model('File', fileSchema);
