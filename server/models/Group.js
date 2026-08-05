const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new Schema(
  {
    groupName: { type: String, required: true, trim: true, maxlength: 80 },
    vibeDescription: { type: String, default: '' },
    university: { type: String, default: '' },
    major: { type: String, default: '' },
    lifestyleTags: { type: [String], default: [] },
    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    moveInDate: { type: String, default: null },
    spots: { type: Number, required: true },
    genderPreference: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    badge: { type: String, default: '' },
    heroImgUrl: { type: String, default: '' },
    lease: { type: String, default: '' },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', default: null },
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    applications: {
      type: [
        {
          _id: false,
          name: { type: String, required: true },
          age: { type: Number },
          gender: { type: String },
          email: { type: String, required: true },
          notes: { type: String, default: '' },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    preferences: {
      type: [
        {
          _id: false,
          icon: String,
          label: String,
          value: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

groupSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Group', groupSchema);