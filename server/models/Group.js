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

    // this is a safety net, and acts as a defined place for storing values in the future,
    // like setting a hero image or linking a listing.
    // these have no UI to set them yet (create group does not collect these parameters).
    // they default to empty so the profile page renders safely.
    badge: { type: String, default: '' },
    heroImgUrl: { type: String, default: '' },
    lease: { type: String, default: '' },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', default: null },
    members: {
      type: [
        {
          _id: false,
          id: String,
          initials: String,
          color: String,
          imgUrl: String,
        },
      ],
      default: [],
    },
    preferences: {
      type: [
        {
          _id: false,
          icon: String, // 'clean' | 'noise' | 'social'
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

export const Group = mongoose.model('Group', groupSchema);
