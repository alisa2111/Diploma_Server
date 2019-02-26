import mongoose, { Schema } from 'mongoose'

const moneyFlowSchema = new Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  type: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  },
}, {
  timestamps: true
})

moneyFlowSchema.methods = {
  view (full) {
    let view = {}
    let fields = ['type', 'key', 'value', 'comment', 'accountId']

    if (full) {
      fields = [...fields, 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] })

    return view
  }

}

const model = mongoose.model('MoneyFlow', moneyFlowSchema)
export const schema = model.schema
export default model
