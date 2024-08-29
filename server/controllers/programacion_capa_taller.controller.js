import { ProgramacionCapaTaller } from '../models/programacion_capa_taller.model.js';

class ProgramacionCapaTallerController {
    static async getProgramacionesCT(req, res){
        try {
            const  programacionesCT = await ProgramacionCapaTaller.getProgramacionesCT();
            res.status( 200  ).json( programacionesCT );
        } catch (error) {
            res.status( 500  ).json( { message: "Error al obtener las programaciones" +  error } );
        }
    }   

    static async getProgramacionCT(req, res){
        try {
            const id_procaptall = req.params.id;
            const  programacionCT = await ProgramacionCapaTaller.getProgramacionCT(id_procaptall);
            if  ( ProgramacionCapaTaller ) {
                res.status( 200  ).json( programacionCT );
            } else {
                res.status( 404  ).json( { message: "Programacion no encontrada" } );
            }
        } catch (error) {
            res.status( 500  ).json( { message: "Error al obtener la programacion" +  error } );
        }
    }

    static async putProgramacionCT(req, res){
        try {
            const update_programacionCT = {
                sede_procaptall:  req.body.sede_procaptall,
                descripcion_procaptall: req.body.descripcion_procaptall,
                fecha_procaptall:  req.body.fecha_procaptall,
                horaInicio_procaptall: req.body.horaInicio_procaptall,
                horaFin_procaptall:  req.body.horaFin_procaptall,
                id_TallerFK: req.body.id_TallerFK,
                id_CapacFK: req.body.id_CapacFK,
                numero_FichaFK: req.body.numero_FichaFK,
            }
            const id_procaptall = req.params.id;
            await ProgramacionCapaTaller.update_programacionCT(id_procaptall, update_programacionCT);
            res.status( 200  ).json( { message: "Programacion actualizada con éxito"} );
        } catch (error) {
            res.status( 500  ).json( { message: "Error al actualizar la programacion" +  error } );
        }
    }

    static  async postProgramacionCT(req, res){
        try {
            const pct = {
                sede_procaptall:  req.body.sede_procaptall,
                descripcion_procaptall: req.body.descripcion_procaptall,
                fecha_procaptall:  req.body.fecha_procaptall,
                horaInicio_procaptall: req.body.horaInicio_procaptall,
                horaFin_procaptall:  req.body.horaFin_procaptall,
                id_TallerFK: req.body.id_TallerFK,
                id_CapacFK: req.body.id_CapacFK,
                numero_FichaFK: req.body.numero_FichaFK,
            }
            await ProgramacionCapaTaller.createProgramacionCT(pct);
            res.status( 201 ).json( { message: "Programacion creada con exito" } );
        } catch (error) {
            res.status( 500  ).json( { message: "Error al crear la programacion" + error } );
        }
    }

    static async deleteProgramacionCT(req, res) {
        try {
            const { id_procaptall } = req.params;
            console.log('id_procaptall:', id_procaptall);
            const result = await ProgramacionCapaTaller.eliminarProgramacionCT(id_procaptall);
            if (result) {
                res.status(200).json({ message: 'Programacion eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Programacion no encontrada' });
            }
        } catch (error) {
            console.error(`Error al eliminar la programacion: ${error.message}`);
            res.status(500).json({ message: 'Error al eliminar la programacion' });
        }
    }
}

export default ProgramacionCapaTallerController;