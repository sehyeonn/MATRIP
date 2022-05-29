//***************************
// 여행 지역 정보를 저장하는 모델
//***************************
const Sequelize = require('sequelize');

module.exports = class Location extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Location',
            tableName: 'locations',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Location.hasMany(db.Spot);
        db.Location.hasOne(db.Trip);
    }
}