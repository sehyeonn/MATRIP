//***************************
// 관광지 정보를 저장하는 모델
//***************************
const Sequelize = require('sequelize');

module.exports = class Spot extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            lat: {      // 위도
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            lng: {      // 경도
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            type: {     // 관광지 0, 맛집 1
                type: Sequelize.TINYINT,
                allowNull: false,
            },
            contents: {     // 관광지 설명
                type: Sequelize.TEXT,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Spot',
            tableName: 'spots',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Spot.hasOne(db.TripDetail);
        db.Spot.belongsTo(db.Location);
    }
}