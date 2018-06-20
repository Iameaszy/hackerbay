const { db } = require('../../config/db/psql.js');
const bcrypt = require('bcrypt');

const { sequelize, Sequelize } = db;

const UserModel = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
});

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
UserModel.beforeCreate((user) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(user.password, 15, (err, hash) => {
      if (err) {
        reject(err);
      }
      user.password = hash;
      resolve(true);
    });
  });
});
sequelize.sync({ force: true }).then(() => {
  console.log('database and table created');
});
exports.UserModel = UserModel;
