const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Location = require('./location');
const Spot = require('./spot');
const Trip = require('./trip');
const TripDetail = require('./tripdetail');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Location = Location;
db.Spot = Spot;
db.Trip = Trip;
db.TripDetail = TripDetail;

User.init(sequelize);
Location.init(sequelize);
Spot.init(sequelize);
Trip.init(sequelize);
TripDetail.init(sequelize);

User.associate(db);
Location.associate(db);
Spot.associate(db);
Trip.associate(db);
TripDetail.associate(db);

module.exports = db;
