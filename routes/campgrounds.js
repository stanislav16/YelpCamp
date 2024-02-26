const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn } = require("../utils/middleware");
const router = express.Router();
const { isAuthor } = require("../utils/middleware");
const { validateCamp } = require("../utils/middleware");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const camps = await Campground.find({});
    res.render("camps/index", { camps });
  })
);

router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render("camps/new");
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCamp,
  catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      res.redirect("/campgrounds");
    } else {
      res.render("camps/show", { camp });
    }
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      res.redirect("/campgrounds");
    } else {
      res.render("camps/edit", { camp });
    }
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCamp,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id);
    camp.set(req.body.campground);
    await camp.save();
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
