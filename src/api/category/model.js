import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  color: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  iconKey: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

categorySchema.methods = {
  view (full) {
    let view = {};
    let fields = ['id', 'title', 'accountId', 'color', 'iconKey'];

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] });

    return view
  }
};

const model = mongoose.model('Category', categorySchema);
export const schema = model.schema;
export default model
