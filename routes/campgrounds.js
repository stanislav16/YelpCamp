const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn } = require("../utils/middleware");
const router = express.Router();
const { isAuthor, validateCamp } = require("../utils/middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCamp,
    catchAsync(campgrounds.postCamp)
  );

router.get("/new", isLoggedIn, catchAsync(campgrounds.newCampForm));

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCamp,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampForm)
);

module.exports = router;
