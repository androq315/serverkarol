import { Capacitador } from '../models/capacitador.model.js';  // Ajusta la ruta según tu estructura de directorios
import { Administrador } from '../models/administrador.model.js';
import { Instructor } from '../models/instructor.model.js';
import { Usuario } from '../models/usuario.model.js';
import bcrypt from 'bcrypt';

class UsuarioController {

// Nuevo método para obtener el perfil del usuario
static async getPerfil(req, res) {
  try {
    const id = req.params.id;
    const perfil = await Usuario.obtenerPerfilUsuario(id); // Llamamos a la función en el modelo
    
    if (!perfil) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil del usuario: " + error.message });
  }
}

  static async getUsuarios(req, res) {
    try {
      const usuarios = await Usuario.getUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" + error });
    }
  }



static async getUsuario(req, res) {
  const { tipoDoc, documento, nombre } = req.params;

  try {
    if (tipoDoc && documento) {
      // Ejecuta el procedimiento almacenado y captura el resultado completo
      const results = await Usuario.getbuscarUsuario(tipoDoc, documento, nombre || null);

      // Extrae solo el primer bloque de datos que contiene la información del usuario
      const usuario = Array.isArray(results) && results.length > 0 ? results[0] : null;

      console.log('Usuario encontrado:', usuario);

      if (usuario) {
        return res.status(200).json(usuario);
      } else {
        return res.status(404).json({ message: 'No se encontró el usuario' });
      }
    } else {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
}

  
  
  
  
static async putUsuario(req, res) {
  try {
    const { nombre, apellido, correo_Usua, clave_Usua, genero, id_Rol1FK, estado } = req.body;
    const id_Usuario = req.params.id_Usuario;

    // Validar que todos los parámetros necesarios estén presentes
    if (!nombre || !apellido || !correo_Usua || !genero || !id_Rol1FK || estado === undefined) {
      return res.status(400).json({ message: "Faltan parámetros necesarios." });
    }

    // Crear el objeto de usuario a actualizar
    const update_usuario = {
      nombre,
      apellido,
      correo_Usua,
      clave_Usua, // La clave será encriptada en el modelo si se proporciona
      genero,
      id_Rol1FK,
      estado // Incluir el estado en la actualización
    };

    // Llamar al método del modelo que invoca el procedimiento almacenado
    await Usuario.updateUsuario(id_Usuario, update_usuario);

    res.status(200).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.error(`Error al actualizar el usuario: ${error.message}`);
    res.status(500).json({ message: `Error al actualizar el usuario: ${error.message}` });
  }
}


static async postUsuario(req, res) {
  const {
    correo,
    clave,
    rol,
    nombre,
    apellido,
    genero,
    tipoDocumento,
    documento,
  } = req.body;

  // Validar campos obligatorios
  if (!correo || !clave || !rol) {
    return res.status(400).json({ message: 'Correo, clave y rol son requeridos.' });
  }

  const rolesValidos = [1, 2, 3]; // Roles válidos
  if (!rolesValidos.includes(parseInt(rol, 10))) {
    return res.status(400).json({ message: 'Rol de usuario no reconocido.' });
  }

  try {
    // Hashear la contraseña antes de pasarla al procedimiento
    const hashedPass = await bcrypt.hash(clave, 10);
    
    // Crear objeto usuario para el procedimiento
    const usuarioData = {
      correo_Usua: correo,
      clave_Usua: hashedPass, // Asegúrate de que la clave se guarde hasheada
      id_Rol1FK: rol,
      nombre,
      apellido,
      genero,
      tipodoc: tipoDocumento,
      documento,
    };

    // Llamar al procedimiento almacenado
    await Usuario.registrarUsuario(usuarioData);

    res.status(201).json({ message: 'Usuario creado correctamente.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario: ' + error.message });
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