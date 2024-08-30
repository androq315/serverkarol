import { DataTypes, INTEGER, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from 'bcrypt'

class Usuario extends Model {
  static async createUsuario(usuario) {
    try {
      const hashedPass = await bcrypt.hash(usuario.clave_Usua, 2);
      usuario.clave_Usua = hashedPass;
      return await this.create(usuario);
    } catch (error) {
      console.error(`error al crear usuaurio: ${error}`);
      throw error;
    }
  }

  static async alternarEstadoUsuario(id_Usua) {
    try {
      const result = await sequelize.query(
        'CALL AlternarEstadoUsuario(:id_Usua)',
        {replacements: { id_Usua }, type: sequelize.QueryTypes.RAW}
      );
      return result;
    } catch (error) {
      console.error(`Error al alternar estado del usuario: ${error}`);
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

  async comparar_clave(clave){
    console.log("Comparando", clave, "con", this.clave_Usua); // Log para verificar lo que se está comparando
    return await bcrypt.compare(clave, this.clave_Usua)
  }

}

Usuario.init(
  {
    id_Usua: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correo_Usua: { type: DataTypes.STRING(35), allowNull: false },
    clave_Usua: { type: DataTypes.STRING(40), allowNull: false },
    estado_Usua:  { type: DataTypes.BOOLEAN, defaultValue: true ,allowNull: false },
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
