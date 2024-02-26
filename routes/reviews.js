const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middleware");

router.post("/", isLoggedIn, validateReview, async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${camp._id}`);
});

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash = ("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);
module.exports = router;
