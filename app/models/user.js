const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { sequelize } = require('../../config/db/psql.js');


const UserModel = sequelize.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
    },
  },
);

UserModel.prototype.toJSON = function doSomething() {
  const values = Object.assign({}, this.get());

  delete values.password;
  return values;
};

function comparePassword(pass) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, user.password, (err, stat) => {
      if (err) {
        return reject(err);
      }

      resolve(stat);
    });
  });
}
UserModel.prototype.comparePassword = comparePassword;
UserModel.beforeCreate(
  user => new Promise((resolve, reject) => {
    bcrypt.hash(user.password, 15, (err, hash) => {
      if (err) {
        reject(err);
      }
      user.password = hash;
      resolve(true);
    });
  }),
);

module.exports = { UserModel };
