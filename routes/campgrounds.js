const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas.js");
const router = express.Router();

function validateCamp(req, res, next) {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const camps = await Campground.find({});
    res.render("camps/index", { camps });
  })
);

router.get(
  "/new",
  catchAsync(async (req, res) => {
    res.render("camps/new");
  })
);

router.post(
  "/",
  validateCamp,
  catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews");
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
