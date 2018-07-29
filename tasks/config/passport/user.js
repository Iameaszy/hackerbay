const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { UserModel } = require('../../app/models/index');

passport.use(
  'user-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      if (!verifyEmail(email)) {
        return done(null, false, { message: 'Invalid email' });
      }
      let user;
      try {
        user = await UserModel.findOne({ where: { email } });
      } catch (e) {
        return done(e);
      }

      if (!user) {
        return done(null, false, {
          message: 'User does not exist',
        });
      }
      const stat = await user.comparePassword(password);
      if (stat) {
        done(null, user, {
          message: 'Successful login',
        });
      } else {
        done(null, false, {
          message: 'Invalid Password',
        });
      }
    },
  ),
);

passport.use(
  'user-register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      if (!verifyEmail(email)) {
        return done(null, false, { message: 'Invalid email' });
      }
      let user;
      try {
        user = await UserModel.findOne({ where: { email } });
      } catch (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, { message: 'User already exists' });
      }
      if (!user) {
        let newUser;
        const newUserBuild = UserModel.build({ email, password });
        try {
          newUser = await newUserBuild.save();
        } catch (e) {
          return done(e);
        }
        return done(null, newUser, { message: 'User created successfully' });
      }
    },
  ),
);

function verifyEmail(email) {
  const regex = /^[a-z]\w{2,}@[a-z]{2,}\.([a-z]{1,4}|[a-z]{2,}\.[a-z]{1,4})[a-z]$/i;
  return regex.test(email);
}
