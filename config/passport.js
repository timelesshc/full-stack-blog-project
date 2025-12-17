const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  // define local strategy for email and password authentication
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // find the user
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "No user found" });
          }

          // compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }
          // authentication successful
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
