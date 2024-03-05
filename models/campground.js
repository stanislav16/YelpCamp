const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
