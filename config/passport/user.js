const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validator = require('validator');
const {
  ExtractJwt,
  Strategy: JwtStrategy,
} = require('passport-jwt');
const {
  UserModel,
} = require('../../app/models/index');

const {
  SECRET,
} = process.env;

class Passport {
  constructor(passport) {
    this.passport = passport;
    this.opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    };
    this.jwt();
    this.register();
    this.login();
  }

  jwt() {
    this.passport.use(new JwtStrategy(this.opts, (payload, done) => {
      UserModel.findOne({
        where: {
          email: payload.email,
        },
      }).then((user) => {
        if (user) {
          return done(null, user);
        }
        done(null, false, {
          message: 'Unauthorized Acesss',
        });
      })
        .catch(err => done(err));
    }));
  }

  register() {
    this.passport.use(
      'user-register',
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, reqEmail, password, done) => {
        const email = reqEmail.toLowerCase();
        if (!validator.isEmail(email)) {
          return done(null, false, {
            message: 'Invalid email',
          });
        }
        let user;
        try {
          user = await UserModel.findOne({
            where: {
              email,
            },
          });
        } catch (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {
            message: 'User already exists',
          });
        }
        if (!user) {
          let newUser;
          const {
            phone,
          } = req.body;
          const newUserBuild = UserModel.build({
            email,
            password,
            phone,
          });
          try {
            newUser = await newUserBuild.save();
          } catch (e) {
            return done(e);
          }
          return done(null, newUser, {
            message: 'User created successfully',
          });
        }
      }),
    );
  }

  login() {
    this.passport.use(
      'user-login',
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
      },
      async (reqEmail, password, done) => {
        const email = reqEmail.toLowerCase();
        if (!validator.isEmail(email)) {
          return done(null, false, {
            message: 'Invalid email',
          });
        }
        let user;
        try {
          user = await UserModel.findOne({
            where: {
              email,
            },
          });
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
      }),
    );
  }
}

module.export = new Passport(passport);
