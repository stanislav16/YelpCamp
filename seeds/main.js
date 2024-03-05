const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp")
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => console.log(err));
const Campground = require("../models/campground");

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "65d86e56ec95e6067a4b9b09",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "YelpCamp/efzvzq2z7wzq2z",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, illum quis iste nihil dolorem accusantium, neque nisi omnis aut veniam numquam illo reprehenderit adipisci non. Laborum explicabo numquam fuga nesciunt?",
      price: price,
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
