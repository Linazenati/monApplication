'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       // Publication appartient à un Voyage
    Publication.belongsTo(models.Voyage, {
      foreignKey: 'id_voyage',
      as: 'voyage',  // Alias pour accéder à la relation dans le code
    });

    // Publication appartient à une Omra
    Publication.belongsTo(models.Omra, {
      foreignKey: ' id_publication',
      as: 'omra',  // Alias pour accéder à la relation dans le code
    });
      
      Publication.hasMany(models.Commentaire, {
    foreignKey: 'id_publication',
    as: 'commentaire'
      });
       Publication.hasMany(models.Reservation, {
    foreignKey: 'id_publication',
    as: 'reservation'
      });
    }
  }
  Publication.init({
    date_publication: DataTypes.DATE,
    plateforme: DataTypes.STRING,
    statut: DataTypes.STRING,
    id_voyage: DataTypes.INTEGER,
    id_omra: DataTypes.INTEGER,
    id_post_facebook: DataTypes.INTEGER,
    id_post_instagram: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};