import XLSX from "xlsx";
import { Ficha } from "../models/ficha.model.js";
import { Horario } from "../models/horario.model.js";
import { Instructor } from "../models/instructor.model.js"; // Asegúrate de importar el modelo Instructor si es necesario
import { Op } from "sequelize";

class ExcelController {
  static async cargarFichas(req, res) {
    try {
      const filePath = req.file.path; // Asegurando la ruta completa dentro de la solicitud
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const fichas = sheetData.map((row) => ({
        numero_Ficha: row.numero_Ficha,
        cordinacion_Ficha: row.cordinacion_Ficha,
      }));

      await Ficha.bulkCreate(fichas);
      res.status(201).json({ message: "Fichas cargadas con éxito" });
    } catch (error) {
      console.error("Error al cargar las fichas:", error);
      res.status(500).json({ message: "Error al cargar las fichas" });
    }
  }

  static async cargarHorarios(req, res) {
    try {
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      }); // Cambiar header: 1 para leer todas las filas

      const horarios = [];
      const errores = [];
      let currentRowIndex = 0;

      // Mapeo de nombres de columnas del Excel a los nombres de columnas en la base de datos
      const columnMapping = {
        TEMATICA: "tematica_Horari",
        AMBIENTE: "ambiente_Horari",
        "fecha inicio/fin de trimestre": "fecha_iniciotrimestre_Horari",
        "fecha fin de trimestre": "fecha_fintrimestre_Horari",
        "Aprendices en formación a la fecha":
          "aprendices_formacionfecha_Horari",
        "Horas asignadas trimestre": "horas_asignadastrimestre_Horari",
        "bloques de hora": "bloque_horaclase_Horari",
        "días de la semana": "fechaDia_Horari",
        "ID del instructor": "id_InstrucFK",
        "número de ficha": "numero_FichaFK",
        "Nombre del instructor": "nombre_Instruc", // Asumiendo que se recibe el nombre completo en el Excel
      };

      // Suponiendo que 'horarios' es un array de objetos que quieres insertar
      const horariosValidos = horarios
        .map((horario) => {
          return {
            horas_asignadastrimestre_Horari: isNaN(
              horario.horas_asignadastrimestre_Horari
            )
              ? null
              : horario.horas_asignadastrimestre_Horari,
            numero_FichaFK: horario.numero_FichaFK || null,
            ambiente_Horari: horario.ambiente_Horari || null,
          };
        })
        .filter(
          (horario) =>
            horario.numero_FichaFK !== null && horario.ambiente_Horari !== null
        );

      try {
        await Horario.bulkCreate(horariosValidos);
        console.log("Horarios cargados exitosamente.");
      } catch (error) {
        console.error("Error al cargar los horarios:", error);
      }

      for (const row of sheetData) {
        // Salta las filas vacías o las que no tengan datos
        if (
          row.every(
            (cell) => cell === null || cell === undefined || cell === ""
          )
        ) {
          continue;
        }

        const horario = {};
        const filaActual = row.join(" ").trim(); // Combina todas las celdas en una sola cadena para simplificar el análisis

        // Analiza la fila y mapea los campos según el formato proporcionado
        if (filaActual.includes("ficha")) {
          const fichaMatch = filaActual.match(/(\d{7,})/);
          if (fichaMatch) {
            horario.numero_FichaFK = parseInt(fichaMatch[1], 10);
          }
        }

        if (filaActual.includes("TEMATICA")) {
          horario.tematica_Horari = filaActual.split("TEMATICA")[1]?.trim();
        }

        if (filaActual.includes("AMBIENTE")) {
          horario.ambiente_Horari = filaActual.split("AMBIENTE")[1]?.trim();
        }

        if (filaActual.includes("Aprendices en formación a la fecha")) {
          horario.aprendices_formacionfecha_Horari = parseInt(
            filaActual.split("Aprendices en formación a la fecha")[1]?.trim(),
            10
          );
        }

        if (filaActual.includes("Horas asignadas trimestre")) {
          horario.horas_asignadastrimestre_Horari = parseInt(
            filaActual.split("Horas asignadas trimestre")[1]?.trim(),
            10
          );
        }

        if (filaActual.includes("fecha inicio/fin de trimestre")) {
          const fechas = filaActual
            .split("fecha inicio/fin de trimestre")[1]
            ?.trim()
            .split(" - ");
          if (fechas.length === 2) {
            horario.fecha_iniciotrimestre_Horari = new Date(fechas[0]);
            horario.fecha_fintrimestre_Horari = new Date(fechas[1]);
          }
        }

        if (filaActual.includes("ID del instructor")) {
          const instructorNombre = filaActual
            .split("ID del instructor")[1]
            ?.trim();
          if (instructorNombre) {
            const [primerNombre, primerApellido] = instructorNombre.split(" ");
            const instructorExistente = await Instructor.findOne({
              where: {
                [Op.and]: [
                  { nombre_Instruc: { [Op.like]: `%${primerNombre}%` } },
                  { nombre_Instruc: { [Op.like]: `%${primerApellido}%` } },
                ],
              },
            });

            if (instructorExistente) {
              horario.id_InstrucFK = instructorExistente.id_Instruc;
            } else {
              errores.push(
                `Instructor con nombre ${instructorNombre} no existe. Registro omitido.`
              );
              continue;
            }
          }
        }

        if (horario.numero_FichaFK) {
          const fichaExistente = await Ficha.findOne({
            where: { numero_Ficha: horario.numero_FichaFK },
          });
          if (fichaExistente) {
            horario.numero_FichaFK = fichaExistente.numero_Ficha;
          } else {
            errores.push(
              `Ficha con número ${horario.numero_FichaFK} no existe. Registro omitido.`
            );
            continue;
          }
        }

        if (Object.keys(horario).length > 0) {
          horarios.push(horario);
        } else {
          console.log("Registro omitido, faltan campos:", horario);
        }
      }

      console.log("Horarios válidos para cargar:", horarios);

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
