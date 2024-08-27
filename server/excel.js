import app from "./app";
import db from "./db.js";

const express = require("express");

const fileUpload = require("express-fileupload");
const uploadOpts = {
  useTempFiles: true,
  tempFileDir: "/tmp/",
};

const XLSX = require("xlsx");
const fs = require("fs");

app.post("/api/v1/books/:id", async (req, res) => {
  try {
    const { excel } = req.files;
    const workbook = XLSX.readFile(excel.tempFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Insertar datos en la tabla Horario
    data.forEach((row) => {
      const query = 
      `
        INSERT INTO Horario (
          tamatica_Horari,
          ambiente_Horari,
          fecha_iniciotrimestre_Horari,
          fecha_fintrimestre_Horari,
          aprendices_formacionfecha_Horari,
          horas_asignadastrimestre_Horari,
          bloque_horaclase_Horari,
          fechaDia_Horari,
          id_InstrucFK,
          id_FichaFK
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        );
      `
      const values = [
        row.tamatica_Horari,
        row.ambiente_Horari,
        row.fecha_iniciotrimestre_Horari,
        row.fecha_fintrimestre_Horari,
        row.aprendices_formacionfecha_Horari,
        row.horas_asignadastrimestre_Horari,
        row.bloque_horaclase_Horari,
        row.fechaDia_Horari,
        row.id_InstrucFK,
        row.id_FichaFK,
      ];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Inserted row: ${results.insertId}`);
        }
      });
    });

    res.status(201).send({ message: "Datos importados con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al importar datos" });
  }
});
