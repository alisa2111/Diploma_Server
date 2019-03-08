import mongoose, { Schema } from 'mongoose'

const sourceSchema = new Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  comment: {
    type: String
  },
  type: {
    type: String, // "cash" || "card"
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


sourceSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'title', 'accountId', 'type', 'comment', 'balance'];

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view
  }

};

const model = mongoose.model('Source', sourceSchema);
export const schema = model.schema;
export default model
