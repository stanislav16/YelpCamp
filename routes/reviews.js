const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.post("/", validateReview, async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${camp._id}`);
});

router.delete(
  "/:reviewId",
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
