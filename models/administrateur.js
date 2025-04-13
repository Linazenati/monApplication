'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Administrateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  Administrateur.belongsTo(models.Utilisateur, {foreignKey:"id_user"} )     
    }
  }
  Administrateur.init({
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Administrateur',
  });
  return Administrateur;
};