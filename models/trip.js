//***************************
// 사용자들의 여행 정보를 저장하는 모델
//***************************
const Sequelize = require('sequelize');

module.exports = class Trip extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            start: {    // 여행 시작일
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            end: {      // 여행 마지막 일
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Trip',
            tableName: 'trips',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Trip.hasMany(db.TripDetail);
        db.Trip.belongsTo(db.User);
        db.Trip.belongsTo(db.Location);
    }
}