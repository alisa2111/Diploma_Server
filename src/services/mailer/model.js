import mongoose, { Schema } from 'mongoose'

const inviteSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account',
  }
}, {
  timestamps: true
});

inviteSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'email', 'accountId'];

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view
  },
};


const model = mongoose.model('Invite', inviteSchema);
export const invSchema = model.schema;
export default model;
