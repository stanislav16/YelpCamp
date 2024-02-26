const Campground = require("../models/campground");

async function index(req, res, next) {
  const camps = await Campground.find({});
  res.render("camps/index", { camps });
}

async function newCampForm(req, res) {
  res.render("camps/new");
}

async function postCamp(req, res, next) {
  const newCamp = new Campground(req.body.campground);
  newCamp.author = req.user._id;
  await newCamp.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCamp._id}`);
}

async function showCampground(req, res) {
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
}

async function editCampForm(req, res) {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
  } else {
    res.render("camps/edit", { camp });
  }
}

async function updateCampground(req, res) {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id);
  camp.set(req.body.campground);
  await camp.save();
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${camp._id}`);
}

async function deleteCampground(req, res) {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
}

module.exports = {
  index,
  newCampForm,
  postCamp,
  showCampground,
  editCampForm,
  updateCampground,
  deleteCampground,
};
