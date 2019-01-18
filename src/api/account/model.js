import mongoose, { Schema } from 'mongoose'

const accountSchema = new Schema({
  balance: {
    type: Number,
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true
});

accountSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'balance', 'users'];

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view
  },
};


const model = mongoose.model('Account', accountSchema);
export const schema = model.schema;
export default model;
