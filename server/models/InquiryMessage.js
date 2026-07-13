import mongoose from 'mongoose'


const inquirySchema = new mongoose.Schema({

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },

  isRead: Boolean,
  messageBody: String,
});

export default mongoose.model(
  "Inquiry",
  inquirySchema,
)
