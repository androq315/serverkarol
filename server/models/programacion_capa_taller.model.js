import { DataTypes, INTEGER, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class ProgramacionCapaTaller extends Model {
  static async createProgramacionCT(ficha) {
    try {
      return await this.create(programacionCT);
    } catch (error) {
      console.error(`error al crear programacion: ${error}`);
      throw error;
    }
  }

  static async getProgramacionesCT() {
    try {
      return await this.findAll();
    } catch (error) {
      console.error(`error al encontrar las programaciones: ${error}`);
      throw error;
    }
  }

  static async getProgramacionCT(id_procaptall) {
    try {
      return await this.findByPk(id_procaptall);
    } catch (error) {
      console.error(`error al encontrar la programacion: ${error}`);
      throw error;
    }
  }

  static async updateProgramacionCT(id, update_programacionCT) {
    try {
      const programacionCT = await this.findByPk(id_procaptall);
      return programacionCT.update(update_programacionCT);
    } catch (error) {
      console.error(`error no se actualizó la programacion: ${error}`);
      throw error;
    }
  }

  static async eliminarProgramacionCT(id_procaptall) {
    try {
      const programacionCT = await ProgramacionCapaTaller.destroy({ where: { id_procaptall } });
      return programacionCT;
    } catch (error) {
      console.error(`error al eliminar la programacion: ${error}`);
      throw error;
    }
  }

}

ProgramacionCapaTaller.init(
  {
    id_procaptall: { type: DataTypes.INTEGER, primaryKey: true },
    sede_procaptall: { type: DataTypes.STRING(40), allowNull: false },
    descripcion_procaptall: { type: DataTypes.STRING(50), allowNull: false },
    fecha_procaptall: { type: DataTypes.DATE, allowNull: false },
    horaInicio_procaptall: { type: DataTypes.DATE, allowNull: false },
    horaFin_procaptall: { type: DataTypes.DATE, allowNull: false },
    id_TallerFK: { type: DataTypes.INTEGER, allowNull: false },
    id_CapacFK: { type: DataTypes.INTEGER, allowNull: false },
    numero_FichaFK: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "ProgramacionCapaTaller",
    timestamps: false,
    underscored: false,
  }
);

export { ProgramacionCapaTaller };
