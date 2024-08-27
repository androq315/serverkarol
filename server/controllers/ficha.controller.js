import { Ficha } from "../models/ficha.model.js"; 

class FichaController {
    static async getFichas(req, res){
        try {
            const  fichas = await Ficha.getFichas();
            res.status( 200  ).json( fichas );
        } catch (error) {
            res.status( 500  ).json( { message: "Error al obtener las fichas" +  error } );
        }
    }   

    static async getFicha(req, res){
        try {
            const id = req.params.id;
            const  ficha = await Ficha.getFicha(id);
            if  ( Ficha ) {
                res.status( 200  ).json( ficha );
            } else {
                res.status( 404  ).json( { message: "Ficha no encontrada" } );
            }
        } catch (error) {
            res.status( 500  ).json( { message: "Error al obtener la ficha" +  error } );
        }
    }

    static async putFicha(req, res){
        try {
            const update_ficha = {
                cordinacion_Ficha: req.body.cordinacion_Ficha,
                numero_Ficha:  req.body.numero_Ficha
            }
            const id = req.params.id;
            await Ficha.updateFicha(id, update_ficha);
            res.status( 200  ).json( { message: "Ficha actualizada con éxito"} );
        } catch (error) {
            res.status( 500  ).json( { message: "Error al actualizar la ficha" +  error } );
        }
    }

    static  async postFicha(req, res){
        try {
            const fi = {
                cordinacion_Ficha: req.body.cordinacion_Ficha,
                numero_Ficha:  req.body.numero_Ficha
            }
            await  Ficha.createFicha(fi);
            res.status( 201 ).json( { message: "Ficha creada con exito" } );
        } catch (error) {
            res.status( 500  ).json( { message: "Error al crear la ficha" + error } );
        }
    }

    static async deleteFicha(req, res) {
        try {
            const { id_Ficha } = req.params;
            console.log('id_Ficha:', id_Ficha);
            const result = await Ficha.eliminarFicha(id_Ficha);
            if (result) {
                res.status(200).json({ message: 'Ficha eliminada exitosamente' });
            } else {
                res.status(404).json({ message: 'Ficha no encontrada' });
            }
        } catch (error) {
            console.error(`Error al eliminar la ficha: ${error.message}`);
            res.status(500).json({ message: 'Error al eliminar la ficha' });
        }
    }
}

export default FichaController;