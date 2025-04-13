'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoyageOrganise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VoyageOrganise.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_de_depart: DataTypes.DATE,
    destination: DataTypes.STRING,
    prix: DataTypes.FLOAT,
    statut: DataTypes.STRING,
    plateforme: DataTypes.STRING,
    image: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'VoyageOrganise',
  });
  return VoyageOrganise;
};