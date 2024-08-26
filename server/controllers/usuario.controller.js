import { Usuario } from "../models/usuario.model.js";

class UsuarioController {
  static async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.getUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" + error });
    }
  }

  static async getUsuario(req, res) {
    try {
      const id = req.params.id;
      const usuario = await Usuario.getUsuario(id);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario" + error });
    }
  }

  static async putUsuario(req, res) {
    try {
      const update_usuario = {
        correo_Usua: req.body.correo_Usua,
        clave_Usua: req.body.clave_Usua,
        estado_Usua: req.body.estado_Usua,
        id_Rol1FK: req.body.id_Rol1FK,
      };
      const id = req.params.id;
      await Usuario.updateUsuario(id, update_usuario);
      res.status(200).json({ message: "Usuario actualizado con éxito" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el usuario" + error });
    }
  }

  static async postUsuario(req, res) {
    try {
      const u = {
        correo_Usua: req.body.correo_Usua,
        clave_Usua: req.body.clave_Usua,
        estado_Usua: req.body.estado_Usua,
        id_Rol1FK: req.body.id_Rol1FK,
      };
      await Usuario.createUsuario(u);
      res.status(201).json({ message: "Usuario creado con exito" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear usuario" + error });
    }
  }

  static async inactivarUsuario(req, res) {
    try {
        const id = parseInt(req.params.id, 10); // Asegúrate de que el ID sea un número entero
        if (isNaN(id)) {
          return res.status(400).json({ message: "ID inválido" });
        }
        const result = await Usuario.alternarEstadoUsuario(id);
        res.status(200).json({ message: "Estado del usuario alterado con éxito" });
      } catch (error) {
        res.status(500).json({ message: "Error al alterar el estado del usuario: " + error.message });
      }
}

}

export default UsuarioController;
