import mongoose from 'mongoose';

const { Schema } = mongoose;

export const CAMPUSES = ['DLSU-MANILA', 'UP MANILA', 'UST', 'UP-DILIMAN', 'ATENEO MAIN CAMPUS'];
export const STATUSES = ['occupied', 'available'];

const listingSchema = new Schema(
  {
    // _id is supplied explicitly on helpers.js generateListingId().
    _id: { type: Number },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', maxlength: 3000 },
    price: { type: Number, required: true, min: 0 },
    status: { type: String, enum: STATUSES, default: 'available' },
    nearbyCampus: { type: String, enum: CAMPUSES, required: true },
    img: { type: String, default: null }, // /uploads/{generatedcode}.jpg
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

listingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Listing = mongoose.model('Listing', listingSchema);
