'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
   Agent.belongsTo(models.Utilisateur, {foreignKey: 'id_user',  // clé étrangère
      });    }
  }
  Agent.init({
    matricule: DataTypes.STRING,
    dateEmbauche: DataTypes.DATE,
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};