import { Administrador } from "../models/administrador.model.js";
import UsuarioController from "./usuario.controller.js";

class AdministradorController extends UsuarioController {
  constructor() {
    super(); // Llama al constructor de la clase UsuarioController
  }

  static async getAdministradores(req, res) {
    try {
      const administradores = await Administrador.getAdministrador();
      res.status(200).json(administradores);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener administrador" + error });
    }
  }

  static async getAdministrador(req, res) {
    try {
      const id = req.params.id;
      const administrador = await Administrador.getAdministrador(id);
      if (administrador) {
        res.status(200).json(administrador);
      } else {
        res.status(404).json({ message: "Administrador no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el administrador" + error });
    }
  }

  static async putAdministrador(req, res) {
    try {
      const update_administrador = {
        nombre_Admin: req.body.nombre_Admin,
        apellido_Admin: req.body.apellido_Admin,
        estado_Usua: req.body.estado_Usua,
        id_Usua2FK: req.body.id_Usua2FK,
      };
      const id = req.params.id;
      await Administrador.updateAdministrador(id, update_administrador);
      res.status(200).json({ message: "Administrador actualizado con éxito" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el administrador" + error });
    }
  }

  static async postAdministrador(req, res) {
    try {
      const ad = {
        nombre_Admin: req.body.nombre_Admin,
        apellido_Admin: req.body.apellido_Admin,
        id_Usua2FK: req.body.id_Usua2FK,
      };
      await Administrador.createAdministrador(ad);
      res.status(201).json({ message: "Administrador creado con exito" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear Administrador" + error });
    }
  }
}

export  default AdministradorController;