/* this file just got changed by Philip, the draft of the listing is not as updated as the final fields that the listing will take.
 * This is now the (hopefully) final fields of a listing, i will refactor your react container for you too to take the new model thank u
 */


/* Changes from initial model
 *
 * no longer using an enum, the react front end already makes sure that the inputs in enum related fields are defined properly, 
 * doing this since it makes the model page cleaner and less strict that might break things
 * 
 * making imageUrl a [string] JUST IN CASE  we plan to move to muliple pictures in the future
 *
 * */

/*
* CHANGES BY IAN: converted to CommonJS to match the backend
*/

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  roomTitle: String,
  price: Number,

  gender: {
    type: String,
    enum: ["male", "female", "co-ed"]
  },

  isOccupied: Boolean,
  description: String,
  tags: [String],
  amenities: [String],
  buildingName: String,
  latitude: Number,
  longitude: Number,
  nearestCampus: String,
  contacts: [String],

  imageUrl: {
    type: [String],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Listing", listingSchema);
