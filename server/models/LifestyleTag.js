const mongoose = require('mongoose');

const { Schema } = mongoose;

const lifestyleTagSchema = new Schema(
  {
    _id: { type: String }, // e.g. "early_bird"
    label: { type: String, required: true },
    icon: { type: String, default: '' },
  },
  { versionKey: false }
);

lifestyleTagSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const LifestyleTag = mongoose.model('LifestyleTag', lifestyleTagSchema);

module.exports = { LifestyleTag };
