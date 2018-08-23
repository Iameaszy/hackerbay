const { UserModel } = require('./user');
const { WebsiteModel } = require('./website');
const { sequelize } = require('../../config/db/psql.js');


UserModel.hasMany(WebsiteModel, {
  foreignKey: 'userId',
});

WebsiteModel.belongsTo(UserModel, { foreignKey: 'userId' });


<<<<<<< HEAD
sequelize.sync()
=======
sequelize.sync({ force: true })
>>>>>>> 750a765eeb864670ad2986b1755be89ec359abb8
  .then(() => {
    console.log('tables created  successfully');
  })
  .catch(err => console.log('an error occured while creating database tables', err));

module.exports = { UserModel, WebsiteModel };
