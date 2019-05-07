import mongoose, { Schema } from 'mongoose'

const moneyFlowSchema = new Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  type: {
    type: String, // 'income' || 'expense'
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Source'
  },
  date: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

moneyFlowSchema.methods = {
  view (full) {
    let view = {};
    let fields = ['accountId', 'type', 'amount', 'comment', 'categoryId', 'sourceId', 'date'];

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view;
  }

};

const model = mongoose.model('MoneyFlow', moneyFlowSchema);
export const schema = model.schema;
export default model
