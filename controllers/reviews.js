const Campground = require("../models/campground");
const Review = require("../models/review");

async function createReview(req, res) {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${camp._id}`);
}

async function deleteReview(req, res) {
  await Campground.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash = ("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports = {
  createReview,
  deleteReview,
};
