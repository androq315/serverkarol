import { DataTypes, INTEGER, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from 'bcrypt'

class Usuario extends Model {
  static async createUsuario(usuario) {
    try {
      const hashedPass = await bcrypt.hash(usuario.clave_Usua, 10); // Usar 10 es más recomendado para hashing
      usuario.clave_Usua = hashedPass;
      return await this.create(usuario);
    } catch (error) {
      console.error(`Error al crear usuario: ${error}`);
      throw error;
    }
  }

  static async obtenerPerfilUsuario(id_Usua) {
    try {
      const perfil = await sequelize.query(
        `SELECT u.correo_Usua, u.estado_Usua, u.clave_Usua,
                r.nombre_Rol, 
                c.nombre_Capac, c.apellidos_Capac, c.genero_Capac, c.tipodoc_Capac, c.documento_Capac,
                a.nombre_Admin, a.apellido_Admin, a.genero_Admin, a.tipodoc_Admin, a.documento_Admin,
                i.nombre_Instruc, i.apellido_Instruc, i.genero_Instruc, i.tipodoc_Instruc, i.documento_Instruc
         FROM Usuario u
         INNER JOIN Rol r ON u.id_Rol1FK = r.id_Rol
         LEFT JOIN Capacitador c ON u.id_Usua = c.id_Usua1FK
         LEFT JOIN Administrador a ON u.id_Usua = a.id_Usua2FK
         LEFT JOIN Instructor i ON u.id_Usua = i.id_Usua3FK
         WHERE u.id_Usua = :id_Usua`,
        {
          replacements: { id_Usua },
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      // Procesar los resultados para eliminar campos nulos
      const perfilLimpiado = perfil.length ? perfil[0] : null;
      
      if (perfilLimpiado) {
        // Eliminar campos nulos
        const { nombre_Capac, apellidos_Capac, genero_Capac, tipodoc_Capac, documento_Capac, 
                nombre_Admin, apellido_Admin, genero_Admin, tipodoc_Admin, documento_Admin,
                nombre_Instruc, apellido_Instruc, genero_Instruc, tipodoc_Instruc, documento_Instruc,
                ...resto } = perfilLimpiado;
  
        // Filtrar campos nulos
        const perfilFiltrado = {
          ...resto,
          ...(nombre_Capac && { nombre_Capac }),
          ...(apellidos_Capac && { apellidos_Capac }),
          ...(genero_Capac && { genero_Capac }),
          ...(tipodoc_Capac && { tipodoc_Capac }),
          ...(documento_Capac && { documento_Capac }),
          ...(nombre_Admin && { nombre_Admin }),
          ...(apellido_Admin && { apellido_Admin }),
          ...(genero_Admin && { genero_Admin }),
          ...(tipodoc_Admin && { tipodoc_Admin }),
          ...(documento_Admin && { documento_Admin }),
          ...(nombre_Instruc && { nombre_Instruc }),
          ...(apellido_Instruc && { apellido_Instruc }),
          ...(genero_Instruc && { genero_Instruc }),
          ...(tipodoc_Instruc && { tipodoc_Instruc }),
          ...(documento_Instruc && { documento_Instruc }),
        };

        return perfilFiltrado;
      }
  
      return null;
    } catch (error) {
      console.error(`Error al obtener el perfil del usuario: ${error}`);
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

// UsuarioModel.js

static async getbuscarUsuario(tipoDoc, documento, nombre) {
  try {
    const [result] = await sequelize.query(`CALL ObtenerUsuario(:tipoDoc, :documento, :nombre)`, {
      replacements: { 
        tipoDoc, 
        documento, 
        nombre: nombre !== '' ? nombre : null  // Si nombre es un string vacío, lo cambiamos a null
      },
      type: sequelize.QueryTypes.SELECT
    });
    return result;
  } catch (error) {
    console.error(`Error al buscar usuario: ${error}`);
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
    clave_Usua: { type: DataTypes.TEXT, allowNull: false },
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