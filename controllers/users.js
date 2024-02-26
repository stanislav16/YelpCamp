const User = require("../models/user");

function renderRegister(req, res) {
  res.render("users/register");
}

async function registerUser(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const regUser = await User.register(user, password);
    req.login(regUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to YelpCamp!");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
}
function renderLogin(req, res) {
  res.render("users/login");
}

function loginUser(req, res) {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  res.redirect(redirectUrl);
}

function logoutUser(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
}

module.exports = {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
  logoutUser,
};
