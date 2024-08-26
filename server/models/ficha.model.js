import { DataTypes, INTEGER, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Ficha extends Model {
  static async createFicha(ficha) {
    try {
      return await this.create(ficha);
    } catch (error) {
      console.error(`error al crear ficha: ${error}`);
      throw error;
    }
  }

  static async getFichas() {
    try {
      return await this.findAll();
    } catch (error) {
      console.error(`error al encontrar las fichas: ${error}`);
      throw error;
    }
  }

  static async getFicha(id) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      console.error(`error al encontrar la ficha: ${error}`);
      throw error;
    }
  }

  static async updateFicha(id, update_ficha) {
    try {
      const ficha = await this.findByPk(id);
      return ficha.update( update_ficha )
    } catch (error) {
      console.error(`error no se actualizó la ficha: ${error}`);
      throw error;
    }
  }

  static async deleteFicha(id) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      console.error(`error al eliminar la ficha: ${error}`);
      throw error;
    }
  }

}

Ficha.init(
  {
    id_Ficha: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cordinacion_Ficha: { type: DataTypes.STRING(40), allowNull: false },
    numero_Ficha: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize, 
    tableName: "Ficha",
    timestamps: false,
    underscored: false
  }
);

export {Ficha};
