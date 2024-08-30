import XLSX from "xlsx";

import { Ficha } from "../models/ficha.model.js";
import { Horario } from "../models/horario.model.js";
import { Instructor } from "../models/instructor.model.js";
import { Usuario } from "../models/usuario.model.js";
import { Rol } from "../models/rol.model.js";
import { Administrador } from "../models/administrador.model.js";
import { Capacitador } from "../models/capacitador.model.js";
import { Taller } from "../models/taller.model.js";
import { Op } from "sequelize";

class ExcelController {
  static async cargarFichas(req, res) {
    try {
      const filePath = req.file.path; // Asegurando la ruta completa dentro de la solicitud
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const fichas = sheetData.map((row) => {
        // Mapeo flexible de las columnas
        const numeroFichaKey = row.numero_Ficha || row.Ficha;
        const cordinacionFichaKey = row.cordinacion_Ficha || row.Coordinación;

        return {
          numero_Ficha: numeroFichaKey,
          cordinacion_Ficha: cordinacionFichaKey,
        };
      });

      await Ficha.bulkCreate(fichas);
      res.status(201).json({ message: "Fichas cargadas con éxito" });
    } catch (error) {
      console.error("Error al cargar las fichas:", error);
      res.status(500).json({ message: "Error al cargar las fichas" });
    }
  }
  static async cargarTalleres(req, res) {
    try {
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      for (const row of sheetData) {
        const nombreTaller = row["Taller"] || row.nombre_Taller;
        const tipoTaller = row["Tipo de Taller"] || row.tipo_Taller;

        // Validar que ambos campos existan
        if (!nombreTaller || !tipoTaller) {
          console.error(
            `Datos insuficientes en la fila: ${JSON.stringify(row)}`
          );
          throw new Error(
            `Datos insuficientes en la fila: ${JSON.stringify(row)}`
          );
        }

        // Crear el taller
        await Taller.create({
          nombre_Taller: nombreTaller,
          tipo_Taller: tipoTaller,
        });
      }

      res.status(201).json({ message: "Talleres cargados con éxito" });
    } catch (error) {
      console.error("Error al cargar los talleres:", error);
      res.status(500).json({
        message: "Error al cargar los talleres",
        error: error.message,
      });
    }
  }

  static async cargarUsuarios(req, res) {
    try {
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      for (const row of sheetData) {
        const correo = row.correo || row.Email;
        const clave = row.clave || row.Password;
        const rol = row.rol || row.Rol;
        const nombre = row.nombre || row.Nombre;
        const apellido = row.apellido || row.Apellido;
        const tipoDocumento = row["tipo documento"] || row["Tipo Documento"];
        const documento = row.documento || row.Documento;
        const genero = row.genero || row.Género || "No especificado"; // Asignar un valor predeterminado

        // Buscar o crear el rol
        const [rolRecord] = await Rol.findOrCreate({
          where: {
            [Op.or]: [{ nombre_Rol: rol }, { id_Rol: rol }],
          },
          defaults: { nombre_Rol: rol },
        });

        // Crear el usuario
        const usuario = await Usuario.create({
          correo_Usua: correo,
          clave_Usua: clave,
          id_Rol1FK: rolRecord.id_Rol,
        });

        // Insertar en la tabla correspondiente basado en el rol
        if (
          rol.toLowerCase() === "capacitador" ||
          rolRecord.id_Rol === "id_capacitador"
        ) {
          await Capacitador.create({
            nombre_Capac: nombre,
            apellidos_Capac: apellido,
            tipodoc_Capac: tipoDocumento,
            documento_Capac: documento,
            genero_Capac: genero, // Aquí se maneja el valor del género
            id_Usua1FK: usuario.id_Usua,
          });
        } else if (
          rol.toLowerCase() === "administrador" ||
          rolRecord.id_Rol === "id_administrador"
        ) {
          await Administrador.create({
            nombre_Admin: nombre,
            apellido_Admin: apellido,
            tipodoc_Admin: tipoDocumento,
            documento_Admin: documento,
            genero_Admin: genero,
            id_Usua2FK: usuario.id_Usua,
          });
        } else if (
          rol.toLowerCase() === "instructor" ||
          rolRecord.id_Rol === "id_instructor"
        ) {
          await Instructor.create({
            nombre_Instruc: nombre,
            apellido_Instruc: apellido,
            tipodoc_Instruc: tipoDocumento,
            documento_Instruc: documento,
            genero_Instruc: genero,
            id_Usua3FK: usuario.id_Usua,
          });
        }
      }

      res.status(201).json({ message: "Usuarios cargados con éxito" });
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      res.status(500).json({ message: "Error al cargar los usuarios" });
    }
  }
  static async cargarHorarios(req, res) {
    try {
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      const horarios = [];
      const errores = [];

      // Obtener información básica de ficha y fechas del trimestre
      const numeroFicha = sheetData[2]?.[2] ?? null;
      const fechasTrimestre = sheetData[2]?.[5]?.split(" - ") ?? [];
      const horasAsignadasTrimestre = sheetData[2]?.[4] ?? null;
      const fechaFormacion = sheetData[2][3]; // Columna D

      // Agrega los logs aquí para depurar las fechas
        console.log('Fechas Trimestre:', fechasTrimestre);
        console.log('Fecha Inicio:', fechasTrimestre && fechasTrimestre.length > 0 ? new Date(fechasTrimestre[0]) : null);
        console.log('Fecha Fin:', fechasTrimestre && fechasTrimestre.length > 1 ? new Date(fechasTrimestre[1]) : null);


      // Iterar sobre cada bloque de horas
      for (let i = 4; i < sheetData.length; i += 6) {
        // Incremento de 6 para saltar la fila vacía
        if (i + 3 >= sheetData.length) break; // Verificar que las filas existan

        // Leer datos en bloques de 4 filas
        const tematica_Horari = sheetData[i]?.[2] ?? null;
        const nombre_Instruc = sheetData[i + 1]?.[2] ?? null;
        const ambiente_Horari = sheetData[i + 3]?.[2] ?? null;
        const bloque_horaclase_Horari = sheetData[i][1]; // Columna de bloques de horas

        if (!tematica_Horari || !nombre_Instruc || !ambiente_Horari) {
          console.error("Datos incompletos en la fila:", i);
          continue;
        }

        // Iterar sobre los días de la semana (columnas 3 en adelante)
        for (let j = 3; j < (sheetData[i] ? sheetData[i].length : 0); j++) {
          const tematica = sheetData[i]?.[j] ?? null;
          const instructor = sheetData[i + 1]?.[j] ?? null;
          const ambiente = sheetData[i + 3]?.[j] ?? null;

          if (!tematica || !instructor || !ambiente) {
            continue;
          }

          let horario = {
            numero_FichaFK: numeroFicha,
            fecha_iniciotrimestre_Horari:
              fechasTrimestre && fechasTrimestre.length > 0
                ? new Date(fechasTrimestre[0])
                : null,
            fecha_fintrimestre_Horari:
              fechasTrimestre && fechasTrimestre.length > 1
                ? new Date(fechasTrimestre[1])
                : null,
            horas_asignadastrimestre_Horari: horasAsignadasTrimestre,
            fechaDia_Horari: sheetData[3][j], // Días de la semana
            aprendices_formacionfecha_Horari: fechaFormacion, // Fecha de formación
            tematica_Horari: tematica,
            ambiente_Horari: ambiente,
            bloque_horaclase_Horari: bloque_horaclase_Horari,
          };

          // División del nombre y apellido del instructor en el Excel
          const instructorNombres = instructor ? instructor.split(" ") : [];

          // Construir consulta para buscar coincidencia en la base de datos
          const instructorExistente = await Instructor.findOne({
            where: {
              [Op.or]: [
                {
                  nombre_Instruc: {
                    [Op.like]: `%${instructorNombres[0]}%`,
                  },
                  apellido_Instruc: {
                    [Op.like]: `%${
                      instructorNombres[instructorNombres.length - 1]
                    }%`,
                  },
                },
                {
                  nombre_Instruc: {
                    [Op.like]: `%${
                      instructorNombres[instructorNombres.length - 1]
                    }%`,
                  },
                  apellido_Instruc: {
                    [Op.like]: `%${instructorNombres[0]}%`,
                  },
                },
              ],
            },
          });

          if (instructorExistente) {
            horario.id_InstrucFK = instructorExistente.id_Instruc;
          } else {
            errores.push(
              `Instructor con nombre ${instructor} no existe. Registro omitido.`
            );
            continue;
          }

          // Validación de ficha
          const fichaExistente = await Ficha.findOne({
            where: { numero_Ficha: numeroFicha },
          });

          if (!fichaExistente) {
            errores.push(
              `Ficha con número ${numeroFicha} no existe. Registro omitido.`
            );
            continue;
          }

          horarios.push(horario);
        }
      }

      // Inserción en la base de datos
      if (horarios.length > 0) {
        await Horario.bulkCreate(horarios);
      }

      if (horarios.length > 0 && errores.length === 0) {
        res.status(201).json({ message: "Horarios cargados con éxito" });
      } else if (horarios.length > 0 && errores.length > 0) {
        res.status(207).json({
          message:
            "Algunos horarios fueron cargados con éxito, pero hubo errores.",
          errores: errores,
        });
      } else if (horarios.length === 0 && errores.length > 0) {
        res.status(400).json({
          message: "No se cargaron horarios debido a errores.",
          errores: errores,
        });
      } else {
        res
          .status(400)
          .json({ message: "No se encontraron horarios válidos para cargar" });
      }
    } catch (error) {
      console.error("Error al cargar los horarios:", error);
      res.status(500).json({ message: "Error al cargar los horarios" });
    }
  }
}

export default ExcelController;
