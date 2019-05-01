import * as mongoose from 'mongoose';

/**
 * Init variables.
 */
var Schema = mongoose.Schema;

/**
 Role schema.
 */
const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  permissions: [
    {
      type: String
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
})
.index({ name: 1 });

/**
 * Export the role model.
 */
export const roleDB = mongoose.model('Role', roleSchema);
