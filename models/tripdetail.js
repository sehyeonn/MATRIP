//***************************
// 사용자들의 여행 상세 일정 정보를 저장하는 모델
//***************************
const Sequelize = require('sequelize');

module.exports = class TripDetail extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            number: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'TripDetail',
            tableName: 'tripDeails',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.TripDetail.belongsTo(db.Trip);
        db.TripDetail.belongsTo(db.Spot);
    }
}