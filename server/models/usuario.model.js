import { DataTypes, INTEGER, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Usuario extends Model {
  static async createUsuario(usuario) {
    try {
      return await this.create(usuario);
    } catch (error) {
      console.error(`error al crear usuaurio: ${error}`);
      throw error;
    }
  }

  static async getUsuarios() {
    try {
      return await this.findAll();
    } catch (error) {
      console.error(`error al encontrar los usuarios: ${error}`);
      throw error;
    }
  }

  static async getUsuario(id) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      console.error(`error al encontrar el usuario: ${error}`);
      throw error;
    }
  }

  static async updateUsuario(id, update_usuario) {
    try {
      const usuario = await this.findByPk(id);
      return usuario.update( update_usuario )
    } catch (error) {
      console.error(`error no se actualizó el usuario: ${error}`);
      throw error;
    }
  }

}

Usuario.init(
  {
    id_Usua: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correo_Usua: { type: DataTypes.STRING(35), allowNull: false },
    clave_Usua: { type: DataTypes.STRING(40), allowNull: false },
    estado_Usua:  { type: DataTypes.BOOLEAN, allowNull: false },
    id_Rol1FK: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize, 
    tableName: "Usuario",
    timestamps: false,
    underscored: false
  }
);

export {Usuario};
