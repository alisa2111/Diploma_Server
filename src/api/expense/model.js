import mongoose, { Schema } from 'mongoose'

const expenseSchema = new Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Account"
  },
  key: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
}, {
  timestamps: true
});

expenseSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['key', 'value', 'comment', 'accountId'];

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view
  },

};


const model = mongoose.model('Expense', expenseSchema);
export const schema = model.schema;
export default model;
