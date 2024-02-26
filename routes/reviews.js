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
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);
module.exports = router;
