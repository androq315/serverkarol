import { Horario } from "../models/horario.model.js";

class HorarioController {
  static async getHorarios(req, res) {
    try {
      const horarios = await Horario.getHorarios();
      res.status(200).json(horarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener horarios" + error });
    }
  }

  static async getHorario(req, res) {
    try {
      const id = req.params.id;
      const horario = await Horario.getHorario(id);
      if (horario) {
        res.status(200).json(horario);
      } else {
        res.status(404).json({ message: "Horario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el horario" + error });
    }
  }

  static async putHorario(req, res) {
    try {
      const update_horario = {
        tamatica_Horari: req.body.tamatica_Horari,
        ambiente_Horari: req.body.ambiente_Horari,
        fecha_iniciotrimestre_Horari: req.body.fecha_iniciotrimestre_Horari,
        fecha_fintrimestre_Horari: req.body.fecha_fintrimestre_Horari,
        aprendices_formacionfecha_Horari:
          req.body.aprendices_formacionfecha_Horari,
        horas_asignadastrimestre_Horari:
          req.body.horas_asignadastrimestre_Horari,
        bloque_horaclase_Horari: req.body.bloque_horaclase_Horari,
        fechaDia_Horari: req.body.fechaDia_Horari,
        id_InstrucFK: req.body.id_InstrucFK,
        id_FichaFK: req.body.id_FichaFK,
      };
      const id = req.params.id;
      await Horario.updateHorario(id, update_horario);
      res.status(200).json({ message: "Horario actualizado con éxito" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el horario" + error });
    }
  }

  static async postHorario(req, res) {
    try {
      const ho = {
        tamatica_Horari: req.body.tamatica_Horari,
        ambiente_Horari: req.body.ambiente_Horari,
        fecha_iniciotrimestre_Horari: req.body.fecha_iniciotrimestre_Horari,
        fecha_fintrimestre_Horari: req.body.fecha_fintrimestre_Horari,
        aprendices_formacionfecha_Horari: req.body.aprendices_formacionfecha_Horari,
        horas_asignadastrimestre_Horari: req.body.horas_asignadastrimestre_Horari,
        bloque_horaclase_Horari: req.body.bloque_horaclase_Horari,
        fechaDia_Horari: req.body.fechaDia_Horari,
        id_InstrucFK: req.body.id_InstrucFK,
        id_FichaFK: req.body.id_FichaFK,
      };
      await Horario.createHorario(ho);
      res.status(201).json({ message: "Horario creado con exito" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear horario" + error });
    }
  }

  // Eliminar un horario manualmente por ID
  static async deleteHorario(req, res){
    try {
        const id = req.params.id;
        const  horario = await Horario.deleteHorario(id);
        if  ( Horario ) {
            res.status( 200 ).json( horario );
        } else {
            res.status( 404 ).json( { message: "Horario no encontrado" } );
        }
    } catch (error) {
        res.status( 500 ).json( { message: "Error al eliminar el horario" +  error } );
    }
}


}

export default HorarioController;
