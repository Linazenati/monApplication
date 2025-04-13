'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
 Utilisateur.hasMany(models.Agent, {
        foreignKey: 'id_user', // clé étrangère qui pointe vers Utilisateur
        as: 'agents' // alias pour l'association
 });
       Utilisateur.hasMany(models.Administrateur, {
        foreignKey: 'id_user', // clé étrangère qui pointe vers Utilisateur
        as: 'administrateurs' // alias pour l'association
       });
       Utilisateur.hasMany(models.Client, {
        foreignKey: 'id_user', // clé étrangère qui pointe vers Utilisateur
        as: 'clients' // alias pour l'association
      });
    }
    
  }
  Utilisateur.init({
    nom: DataTypes.STRING,
    prenom:DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    telephone: DataTypes.INTEGER,
    
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};