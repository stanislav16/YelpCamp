const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const campground = require("../models/campground");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

async function index(req, res, next) {
  const camps = await Campground.find({});
  res.render("camps/index", { camps });
}

async function newCampForm(req, res) {
  res.render("camps/new");
}

async function postCamp(req, res, next) {
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.campground.location, limit: 1 })
    .send();
  console.log(geoData.body.features);
  const newCamp = new Campground(req.body.campground);
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
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
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  camp.images.push(...imgs);

  if (req.body.campground.location !== camp.location) {
    const geoData = await geocoder
      .forwardGeocode({ query: req.body.campground.location, limit: 1 })
      .send();
    camp.geometry = geoData.body.features[0].geometry;
    camp.location = req.body.campground.location;
  }

  camp.set(req.body.campground);
  await camp.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
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
