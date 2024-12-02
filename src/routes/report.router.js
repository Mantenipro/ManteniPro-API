/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const Report = require('../models/report.model');
const { S3Client } = require('@aws-sdk/client-s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const createError = require('http-errors'); // Asegúrate de tener esta dependencia para errores.
const reportUseCases = require('../usecases/report.usecase');
const auth = require('../middleware/auth.middleware');
const { canCreateTicket } = require('../utils/ticketUtils')
const User = require('../models/user.created.perfil')

const router = express.Router();

// Configura AWS S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Endpoint para generar una URL pre-firmada (presigned URL) para subir una imagen a S3
router.post('/s3/presigned-url', async (req, res) => {
    try {
        const { fileName, fileType } = req.body;

        // Parámetros para generar la URL pre-firmada
        const params = {
            Bucket: process.env.S3_BUCKET_NAME, // Nombre del bucket
            Key: fileName,                      // Nombre del archivo en S3
            ContentType: fileType,              // Tipo de contenido (MIME type) del archivo
        };

        // Genera la URL pre-firmada
        const command = new PutObjectCommand(params);
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // URL válida por 60 segundos

        // Enviar la URL pre-firmada al frontend
        res.json({ url: signedUrl });
    } catch (error) {
        //console.error('Error generando la URL pre-firmada:', error);
        res.status(500).json({
            success: false,
            error: 'Error generando la URL pre-firmada',
        });
    }
});

// Endpoint para crear un nuevo reporte
router.post('/', async (req, res) => {
    try {
      const {
        title,
        image,
        description,
        user,
        company,
        equipment,
        status,
        priority
      } = req.body

      // Validar campos requeridos
      if (!title || !description || !user || !company || !equipment) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos'
        })
      }

      // Verificar el límite de tickets
      if (!(await canCreateTicket(company))) {
        return res.status(403).json({
          success: false,
          error: 'Has alcanzado el límite de tickets para este mes, contacta a tu administrador'
        })
      }

      // Validar que el status esté dentro de los valores permitidos si se proporciona
      const validStatuses = ['pending', 'in-progress', 'completed']
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Estado inválido'
        })
      }

      // Validar que el priority esté dentro de los valores permitidos
      const validPriorities = ['Baja', 'Media', 'Alta', 'Sin Prioridad']
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Prioridad inválida'
        })
      }

      const newReport = await Report.create({
        title,
        image,
        description,
        user,
        company,
        equipment,
        status, // Incluir status solo si se proporciona
        priority: priority || 'Sin Prioridad' // Asignar valor predeterminado si no se especifica
      })

      res.status(201).json({
        success: true,
        data: newReport
      })
    } catch (error) {
        //console.error('Error al crear el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear el reporte',
        });
    }
});

// Endpoint para obtener todos los reportes, con opción de filtrar por prioridad
router.get('/', async (req, res) => {
    try {
        const { priority } = req.query;  // Obtener el parámetro de query 'priority'

        // Si se proporciona un valor para priority, filtrar los reportes por prioridad
        const filter = priority ? { priority } : {};  // Si no hay 'priority', se obtienen todos los reportes

        const reports = await Report.find(filter);

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        //console.error('Error al obtener los reportes:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los reportes',
        });
    }
});

// Ruta para obtener todos los reportes asignados a un técnico específico
router.get('/tecnico', auth, async (req, res) => {
  const technicianId = req.user.id; // Obtener el technicianId del token autenticado
  try {
    const reports = await reportUseCases.getReportsByTecnico(technicianId)
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Endpoint para obtener un reporte por su ID
router.get('/:id', async (req, res) => {
    try {
        const report = await reportUseCases.getReportById(req.params.id)
        if (!report) {
            return res.status(404).json({
                success: false,
                error: 'Reporte no encontrado',
            });
        }
        res.status(200).json({
            success: true,
            data: { report },
        });
    } catch (error) {
        //console.error('Error al obtener el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener el reporte',
        });
    }
});

// Endpoint para actualizar un reporte
router.put('/:id', async (req, res) => {
    try {
        const { title, image, description, user, company, equipment, status, priority } = req.body;

        // Crear un objeto con los campos a actualizar
        const updates = { title, image, description, user, company, equipment };

        // Validar que el status esté dentro de los valores permitidos
        if (status) {
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Estado inválido',
                });
            }
            updates.status = status;
        }

        // Validar que el priority esté dentro de los valores permitidos
        if (priority) {
            const validPriorities = ['Baja', 'Media', 'Alta', 'Sin Prioridad'];
            if (!validPriorities.includes(priority)) {
                return res.status(400).json({
                    success: false,
                    error: 'Prioridad inválida',
                });
            }
            updates.priority = priority;  // Incluir priority en la actualización
        }

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).json({
                success: false,
                error: 'Reporte no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedReport,
        });
    } catch (error) {
        //console.error('Error al modificar el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al modificar el reporte',
        });
    }
});

// Endpoint para eliminar un reporte
router.delete('/:id', async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({
                success: false,
                error: 'Reporte no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: deletedReport,
        });
    } catch (error) {
        //console.error('Error al eliminar el reporte:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar el reporte',
        });
    }
});

// Endpoint para obtener reportes por usuario
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await Report.find({ user: userId }).populate('user').populate('assignedTo')

        if (!reports || reports.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No se encontraron reportes para el usuario especificado',
            });
        }

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        //console.error('Error al obtener los reportes por usuario:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los reportes por usuario',
        });
    }
});

// Endpoint para obtener reportes por compañía
router.get('/company/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const reports = await Report.find({ company: companyId }).populate('assignedTo')
          .populate('user')
          .populate('equipment')
        if (!reports || reports.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No se encontraron reportes para la compañía especificada',
            });
        }

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        //console.error('Error al obtener los reportes por compañía:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los reportes por compañía',
        });
    }
});

// Endpoint para obtener reportes por técnico
router.get('/technician/:technicianId', async (req, res) => {
    try {
        const { technicianId } = req.params;
        const reports = await reportUseCases.getReportsByTecnico(technicianId);

        if (!reports || reports.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No se encontraron reportes para el técnico especificado',
            });
        }

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        //console.error('Error al obtener los reportes por técnico:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los reportes por técnico',
        });
    }
});


module.exports = router;

