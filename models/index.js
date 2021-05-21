const dbConConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {}

// module.exports = async () => {
// try {
const sequelize = new Sequelize(dbConConfig.DB, dbConConfig.USER, dbConConfig.PASSWORD, {
  host: dbConConfig.HOST,
  dialect: dbConConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConConfig.pool.max,
    min: dbConConfig.pool.min,
    acquire: dbConConfig.pool.acquire,
    idle: dbConConfig.pool.idle
  }
});

// const user = require("./user")(sequelize, Sequelize)
// const permission = require("./permission")(sequelize, Sequelize)
// const role = require("./role")(sequelize, Sequelize)
// const roleName = require("./roleNames")(sequelize, Sequelize)
// const permissionName = require("./permissionName")(sequelize, Sequelize)


// const Models = { Info }
// db.user = user
// db.permission = permission
// db.role = role
// db.roleName = roleName
// db.permissionName = permissionName

// await sequelize.sync()
// await sequelize.authenticate()
// console.log("=> Created a new connection")
//  return await Models
//   } catch (err) {
//     console.log(err)
//   }
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    //const model = sequelize['import'](path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;