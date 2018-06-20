const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user = require('../../app/models/user');

const { UserModel } = user;

passport.use(
  'user-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ where: { email } });
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
      } catch (err) {
        done(err);
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
      try {
        const user = await UserModel.findOne({ where: { email } });
        if (user) {
          done(null, false, { message: 'User already exists' });
        }
        if (!user) {
          const newUser = await UserModel.create({ email, password });
          return done(null, newUser, { message: 'User created successfully' });
        }
      } catch (err) {
        console.log(err);
        done(err);
      }
    },
  ),
);
