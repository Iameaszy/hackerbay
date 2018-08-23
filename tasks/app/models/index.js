const { UserModel } = require('./user');
const { WebsiteModel } = require('./website');
const { sequelize } = require('../../config/db/psql.js');


UserModel.hasMany(WebsiteModel, {
  foreignKey: 'userId',
});

WebsiteModel.belongsTo(UserModel, { foreignKey: 'userId' });


sequelize.sync({ force: true })
  .then(() => {
    console.log('tables created  successfully');
  })
  .catch(err => console.log('an error occured while creating database tables', err));

module.exports = { UserModel, WebsiteModel };
