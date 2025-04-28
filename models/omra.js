'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Omra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Omra.belongsTo(models.Agent, {
    foreignKey: 'id_agent',
    as: 'agent'
    });
     Omra.hasMany(models.Omra, {
    foreignKey: 'id_omra',
    as: 'omra'
      });
    }
  }
  Omra.init({
    nom: DataTypes.STRING,
    description: DataTypes.STRING,
    prix: DataTypes.DECIMAL,
    dateDepart: DataTypes.DATE,
    duree: DataTypes.INTEGER,
    estPublie: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    image: DataTypes.STRING,
    id_agent: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Omra',
  });
  return Omra;
};