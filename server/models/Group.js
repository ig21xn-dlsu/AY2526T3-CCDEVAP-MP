import mongoose from 'mongoose';

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

export const Group = mongoose.model('Group', groupSchema);
