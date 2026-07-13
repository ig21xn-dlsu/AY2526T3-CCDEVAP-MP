//FOR MANAGERS ONLY
import mongoose from "mongoose";

const callingCardSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  links: [
    {
      label: { type: String, required: true, trim: true },
      url: { type: String, required: true, trim: true },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CallingCard", callingCardSchema);
