const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const authenticateToken = require("./middleware/authenticateToken");
const userRoutes = require("./routes/userRoutes");


require('dotenv').config();

const jwt = require("jsonwebtoken");
const { stat } = require('fs');

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000', // Especifica el origen exacto
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permite el envío de cookies y credenciales
};

app.use(cors(corsOptions));


app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ limit: '10mb', extended: true }));


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the database');
}).on('error', (err) => {
  console.error('Database connection error:', err);
});

//ROUTES

app.use("/user", userRoutes);


//PHOTOS CRUD
app.get('/photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Photo"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//CRUD ROLES

app.get('/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Rol"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/roles/:id', async (req, res) => {
  const  {id}  = req.params;
  try {
    const query = 'SELECT * FROM "Rol" WHERE id = $1';
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/roles', async (req, res) => {
  const {name} = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El campo "name" no puede estar vacío' });
  }

  try {
    const query = 'INSERT INTO "Rol"(name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [name]);

    res.status(201).json({
      message: 'Rol creado exitosamente',
      rol: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear Rol:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


app.delete('/roles/:id', async (req, res) => {
    const  {id}  = req.params;
  
    try {
      const query = 'DELETE FROM "Rol" WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
  
      res.status(200).json({
        message: 'Rol eliminado exitosamente',
        rol: result.rows[0],
      });
    } catch (error) {
      console.error('Error al eliminar Rol:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

// CRUD INSTITUTIONTYPE

app.get('/institutionTypes', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "InstitutionType" WHERE status = 1');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching InstitutionTypes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.get('/institutionTypesAvailable', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM "InstitutionType" WHERE status = 1');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching InstitutionTypes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/institutionTypes', async (req, res) => {
  const {name} = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El campo "name" no puede estar vacío' });
  }

  try {
    const query = 'INSERT INTO "InstitutionType"(name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [name]);

    res.status(201).json({
      message: 'InstitutionType creado exitosamente',
      rol: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear InstitutionType:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


app.put('/institutionTypes/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({ message: 'El campo "status" es requerido' });
  }

  try {
    const query = 'UPDATE "InstitutionType" SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    res.status(200).json({
      message: 'Status actualizado exitosamente',
      rol: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar el status:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


//INSTITUTION CRUD

app.get('/institutions', async (req, res) => {
    try {
      const result = await pool.query(`SELECT name, description, phone, address, latitude, longitude, status, 
                                     (SELECT name FROM "InstitutionType" WHERE "InstitutionType".id = "Institution"."idInstitutionType") AS type,
                                     (SELECT name FROM "County" WHERE "County".id = "Institution"."idCounty")AS county FROM "Institution"`);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching Institutions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/institutions/:id', async (req, res) => {
    const  {id}  = req.params;
    try {
      const query = 'SELECT * FROM "Institution" WHERE id = $1';
      const result = await pool.query(query, [id]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching Institutions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/institutionsAvailable', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name FROM "Institution" WHERE status = 1');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching Institutions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.post('/institutions', async (req, res) => {
    const { name, description, phone, address, latitude, longitude, status, idInstitutionType, idCounty } = req.body;
  
    if (!name || !description || !phone || !address || !latitude || !longitude || !idInstitutionType || !idCounty) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const query = `
        INSERT INTO "Institution" (name, description, phone, address, latitude, longitude, status, "idInstitutionType", "idCounty")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, name, description, phone, address, latitude, longitude, status, "registerDate", "lastUpdate", "idInstitutionType", "idCounty"`;
  
      const result = await pool.query(query, [name, description, phone, address, latitude, longitude, status, idInstitutionType, idCounty]);
  
      res.status(201).json({
        message: 'Institución creada exitosamente',
        institution: result.rows[0]
      });
    } catch (error) {
      console.error('Error al crear la institución:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

  app.put('/institutions/:id', async (req, res) => {
    const { id } = req.params;
    const {
      name,
      description,
      phone,
      address,
      latitude,
      longitude,
      status,
      type,  // nombre del tipo de institución
      county, // nombre del condado
    } = req.body;
  
    try {
      // Primero, obtenemos los IDs para 'idInstitutionType' y 'idCounty' desde la base de datos
      const typeQuery = 'SELECT id FROM "InstitutionTypes" WHERE name = $1';
      const countyQuery = 'SELECT id FROM "Counties" WHERE name = $1';
  
      const typeResult = await pool.query(typeQuery, [type]);
      const countyResult = await pool.query(countyQuery, [county]);
  
      if (typeResult.rowCount === 0) {
        return res.status(404).json({ message: 'Institution type no encontrado' });
      }
  
      if (countyResult.rowCount === 0) {
        return res.status(404).json({ message: 'County no encontrado' });
      }
  
      const idInstitutionType = typeResult.rows[0].id;  // El ID del tipo de institución
      const idCounty = countyResult.rows[0].id;          // El ID del condado
  
      // Ahora, procedemos con la actualización de la institución
      const query = 
        'UPDATE "Institution" SET name = $1, description = $2, phone = $3, address = $4, latitude = $5, longitude = $6, status = $7, "idInstitutionType" = $8, "idCounty" = $9 WHERE id = $10 RETURNING *';
  
      const result = await pool.query(query, [
        name,
        description,
        phone,
        address,
        latitude,
        longitude,
        status,
        idInstitutionType,  // Usamos el ID de la institución
        idCounty,            // Usamos el ID del condado
        id,
      ]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Institution no encontrada' });
      }
  
      res.status(200).json({
        message: 'Institution updated!',
        institution: result.rows[0], // Devolvemos la institución actualizada
      });
    } catch (error) {
      console.error('Error al actualizar la Institution:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });
  
  

//Login Implementation

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM "User" WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear el token JWT
    const jwtSecret = process.env.JWT_SECRET; // Usa un valor seguro almacenado en .env
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      jwtSecret,
      { expiresIn: "7d" } // Expiración
    );

    // Configurar la cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Evita acceso desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict", // Prevenir CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.status(200).json({ message: 'Login exitoso' });
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


app.post('/logout', (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Sesión cerrada" });
});

//ROUTES

app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Bienvenido, usuario ${req.user.email}` });
});

//USERS CRUD

app.get('/users', async (req, res) => {
  try {
    const query = `SELECT name AS name, lastname, email, ci, phone, username,(SELECT name FROM "Rol" WHERE "Rol".id = "User"."idRol" ) AS rol,status
                   FROM "User"`;
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


app.post('/users', async (req, res) => {
    const {name,
    lastname,
    email,
    ci,
    phone,
    username,
    password,
    status,
    latitude,
    longitude,
    idCounty,
    idRol} = req.body;
    const saltRounds = 10;
  
    // Validar que los campos requeridos no estén vacíos
    if (!name || !lastname || !email || !ci || !phone || !username || !password || !status || !latitude || !longitude || !idCounty || !idRol) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = `
        INSERT INTO "User" (name, lastname, email, ci, phone, username, password, status, latitude, longitude, "idCounty", "idRol")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, name, lastname, email, latitude, longitude, ci, phone, username, password, status, "registerDate", "lastUpdate", "idCounty", "idRol"`;
  
      const result = await pool.query(query, [
        name,
        lastname, 
        email, 
        ci, 
        phone, 
        username, 
        hashedPassword, 
        status, 
        latitude, 
        longitude, 
        idCounty, 
        idRol
      ]);
  
      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });


  app.put('/users/:id', async (req, res) => {
    const {id} = req.params;
    const {password} = req.body;
    const saltRounds = 10;
  
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = 'UPDATE "User" SET password = $1 WHERE id = $2 RETURNING *';
      const result = await pool.query(query, [hashedPassword, id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Password no encontrado' });
      }
  
      res.status(200).json({
        message: 'Password updated!',
        password: result.rows[0],
      });
    } catch (error) {
      console.error('Error al actualizar el status:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });




//COUNTRY, STATE AND COUNTY CRUD

    //COUNTRY 

    app.get('/countries', async (req, res) => {
        try {
        const result = await pool.query('SELECT id, name, status FROM "Country"');
        res.json(result.rows);
        } catch (error) {
        console.error('Error al obtener los países:', error);
        res.status(500).json({ error: 'Error en el servidor' });
        }
    });
  
  
    app.post('/countries', async (req, res) => {
        const { name } = req.body;
        if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'El campo "name" no puede estar vacío' });
        }
    
        try {
        const query = 'INSERT INTO "Country"(name) VALUES ($1) RETURNING id, name, status';
        const result = await pool.query(query, [name]);
    
        res.status(201).json({
            message: 'País creado exitosamente',
            country: result.rows[0]
        });
        } catch (error) {
        console.error('Error al crear el país:', error);
        res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    //STATE

    app.get('/states', async (req, res) => {
        try {
        const result = await pool.query('SELECT id, name, status, "idCountry" FROM "State"');
        res.json(result.rows);
        } catch (error) {
        console.error('Error al obtener los estados:', error);
        res.status(500).json({ error: 'Error en el servidor' });
        }
    });
  
    app.post('/states', async (req, res) => {
        const { name, idCountry } = req.body;
    
        if (!name || name.trim() === '' || !idCountry) {
        return res.status(400).json({ message: 'El nombre y el ID del país son obligatorios' });
        }
    
        try {
        const query = 'INSERT INTO "State"(name, "idCountry") VALUES ($1, $2) RETURNING id, name, status, "idCountry"';
        const result = await pool.query(query, [name, idCountry]);
    
        res.status(201).json({
            message: 'Estado creado exitosamente',
            state: result.rows[0]
        });
        } catch (error) {
        console.error('Error al crear el estado:', error);
        res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    //COUNTY

    app.get('/counties', async (req, res) => {
        try {
        const result = await pool.query('SELECT id, name, status, "idState" FROM "County"');
        res.json(result.rows);
        } catch (error) {
        console.error('Error al obtener los condados:', error);
        res.status(500).json({ error: 'Error en el servidor' });
        }
    });

    app.post('/counties', async (req, res) => {
        const { name, idState } = req.body;
    
        if (!name || name.trim() === '' || !idState) {
        return res.status(400).json({ message: 'El nombre y el ID del estado son obligatorios' });
        }
    
        try {
        const query = 'INSERT INTO "County"(name, "idState") VALUES ($1, $2) RETURNING id, name, status, "idState"';
        const result = await pool.query(query, [name, idState]);
    
        res.status(201).json({
            message: 'Condado creado exitosamente',
            county: result.rows[0]
        });
        } catch (error) {
        console.error('Error al crear el condado:', error);
        res.status(500).json({ message: 'Error en el servidor' });
        }
    });

//ACCIDENTS AND REPORTS CRUD


app.get('/accidents', async (req, res) => {
  try {
  const result = await pool.query(`SELECT id, name, status, "idState" FROM "County"`);
  res.json(result.rows);
  } catch (error) {
  console.error('Error al obtener los condados:', error);
  res.status(500).json({ error: 'Error en el servidor' });
  }
});


//



//reportesdespuesdel registro
app.get('/ReportsV', async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id AS accident_id,
        r.description AS accident_description,
        r.latitude AS accident_latitude,
        r.longitude AS accident_longitude,
        r.status AS accident_status,
        r."registerDate" AS accident_register_date,
        r."lastUpdate" AS accident_last_update,
        u.name AS user_name,
        u.lastname AS user_lastname,
        i.id AS institution_id,
        i.name AS institution_name,
        it.name AS institution_type, 
        i.status AS institution_status,
        img.url AS image_url
      FROM public."Report" r
      LEFT JOIN public."User" u ON r."idUser" = u.id
      LEFT JOIN public."AssigmentAccident" aa ON r.id = aa."idReport"
      LEFT JOIN public."Institution" i ON aa."idInstitution" = i.id
      LEFT JOIN public."InstitutionType" it ON i."idInstitutionType" = it.id
      LEFT JOIN public."Image" img ON img."idReport" = r.id
      ORDER BY r.id;
    `;

    const result = await pool.query(query);

    // Agrupar datos por accidente
    const accidents = {};
    result.rows.forEach((row) => {
      if (!accidents[row.accident_id]) {
        accidents[row.accident_id] = {
          id: row.accident_id,
          description: row.accident_description,
          latitude: row.accident_latitude,
          longitude: row.accident_longitude,
          status: row.accident_status,
          registerDate: row.accident_register_date,
          lastUpdate: row.accident_last_update,
          user: {
            name: row.user_name || null, // Captura el nombre del usuario
            lastname: row.user_lastname || null, // Captura el apellido del usuario
          },
          institutions: [], // Inicializa el arreglo de instituciones
          images: [], // Inicializa el arreglo de imágenes
        };
      }

      // Agregar institución si existe
      if (row.institution_id) {
        const institutionExists = accidents[row.accident_id].institutions.some(
          (inst) => inst.id === row.institution_id
        );

        if (!institutionExists) {
          accidents[row.accident_id].institutions.push({
            id: row.institution_id,
            name: row.institution_name,
            type: row.institution_type,
            status: row.institution_status,
          });
        }
      }

      // Agregar imagen si existe
      if (row.image_url && !accidents[row.accident_id].images.includes(row.image_url)) {
        accidents[row.accident_id].images.push(row.image_url);
      }
    });

    // Convertir el objeto de accidentes en un arreglo
    res.status(200).json(Object.values(accidents));
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
//captura el id
app.get('/ReportsV/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        r.id AS accident_id,
        r.description AS accident_description,
        r.latitude AS accident_latitude,
        r.longitude AS accident_longitude,
        r.status AS accident_status,
        r.audio AS accident_audio, -- Incluye audio
        r.video AS accident_video, -- Incluye video
        r."registerDate" AS accident_register_date,
        r."lastUpdate" AS accident_last_update,
        u.name AS user_name,
        u.lastname AS user_lastname,
        i.id AS institution_id,
        i.name AS institution_name,
        it.name AS institution_type, 
        i.status AS institution_status,
        img.url AS image_url
      FROM public."Report" r
      LEFT JOIN public."User" u ON r."idUser" = u.id
      LEFT JOIN public."AssigmentAccident" aa ON r.id = aa."idReport"
      LEFT JOIN public."Institution" i ON aa."idInstitution" = i.id
      LEFT JOIN public."InstitutionType" it ON i."idInstitutionType" = it.id
      LEFT JOIN public."Image" img ON img."idReport" = r.id
      WHERE r.id = $1
      ORDER BY r.id;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Accidente no encontrado.' });
    }

    const accident = {
      id: result.rows[0].accident_id,
      description: result.rows[0].accident_description,
      latitude: result.rows[0].accident_latitude,
      longitude: result.rows[0].accident_longitude,
      status: result.rows[0].accident_status,
      audio: result.rows[0].accident_audio || null, // Agrega el audio
      video: result.rows[0].accident_video || null, // Agrega el video
      registerDate: result.rows[0].accident_register_date,
      lastUpdate: result.rows[0].accident_last_update,
      user: {
        name: result.rows[0].user_name || null,
        lastname: result.rows[0].user_lastname || null,
      },
      institutions: [],
      images: [],
    };

    result.rows.forEach((row) => {
      if (row.institution_id) {
        const institutionExists = accident.institutions.some(
          (inst) => inst.id === row.institution_id
        );
        if (!institutionExists) {
          accident.institutions.push({
            id: row.institution_id,
            name: row.institution_name,
            type: row.institution_type,
            status: row.institution_status,
          });
        }
      }

      if (row.image_url && !accident.images.includes(row.image_url)) {
        accident.images.push(row.image_url);
      }
    });

    res.status(200).json(accident);
  } catch (error) {
    console.error('Error al obtener el accidente:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});
// API para actualizar el estado del accidente
app.put('/ReportsV/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = `
      UPDATE public."Report"
      SET status = $1, "lastUpdate" = NOW()
      WHERE id = $2
      RETURNING id, status, "lastUpdate";
    `;
    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Accidente no encontrado." });
    }

    res.status(200).json({
      message: "Estado actualizado exitosamente.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar el estado del accidente:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});
//ver los reportes de accidentes
app.get('/ReportsAcidentes', async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id AS accident_id,
        r.description AS accident_description,
        r.latitude AS accident_latitude,
        r.longitude AS accident_longitude,
        r.status AS accident_status,
        r."registerDate" AS accident_register_date,
        r."lastUpdate" AS accident_last_update,
        u.name AS user_name,
        u.lastname AS user_lastname,
        i.id AS institution_id,
        i.name AS institution_name,
        it.name AS institution_type, 
        i.status AS institution_status,
        img.url AS image_url,
        at.id AS accident_type_id,
        at.name AS accident_type_name
      FROM public."Report" r
      LEFT JOIN public."User" u ON r."idUser" = u.id
      LEFT JOIN public."AssigmentAccident" aa ON r.id = aa."idReport"
      LEFT JOIN public."Institution" i ON aa."idInstitution" = i.id
      LEFT JOIN public."InstitutionType" it ON i."idInstitutionType" = it.id
      LEFT JOIN public."Image" img ON img."idReport" = r.id
      LEFT JOIN public."AccidentReport" ar ON r.id = ar."idReport"
      LEFT JOIN public."AccidentType" at ON ar."idAccidentType" = at.id
      ORDER BY r.id;
    `;

    const result = await pool.query(query);

    // Agrupar datos por accidente
    const accidents = {};
    result.rows.forEach((row) => {
      if (!accidents[row.accident_id]) {
        accidents[row.accident_id] = {
          id: row.accident_id,
          description: row.accident_description,
          latitude: row.accident_latitude,
          longitude: row.accident_longitude,
          status: row.accident_status,
          registerDate: row.accident_register_date,
          lastUpdate: row.accident_last_update,
          user: {
            name: row.user_name || null, // Captura el nombre del usuario
            lastname: row.user_lastname || null, // Captura el apellido del usuario
          },
          institutions: [], // Inicializa el arreglo de instituciones
          images: [], // Inicializa el arreglo de imágenes
          accidentTypes: [], // Inicializa el arreglo de tipos de accidentes
        };
      }

      // Agregar institución si existe
      if (row.institution_id) {
        const institutionExists = accidents[row.accident_id].institutions.some(
          (inst) => inst.id === row.institution_id
        );

        if (!institutionExists) {
          accidents[row.accident_id].institutions.push({
            id: row.institution_id,
            name: row.institution_name,
            type: row.institution_type,
            status: row.institution_status,
          });
        }
      }

      // Agregar imagen si existe
      if (row.image_url && !accidents[row.accident_id].images.includes(row.image_url)) {
        accidents[row.accident_id].images.push(row.image_url);
      }

      // Agregar tipo de accidente si existe
      if (row.accident_type_id) {
        const accidentTypeExists = accidents[row.accident_id].accidentTypes.some(
          (type) => type.id === row.accident_type_id
        );

        if (!accidentTypeExists) {
          accidents[row.accident_id].accidentTypes.push({
            id: row.accident_type_id,
            name: row.accident_type_name,
          });
        }
      }
    });

    // Convertir el objeto de accidentes en un arreglo
    res.status(200).json(Object.values(accidents));
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
// Obtener un reporte específico por ID
app.get('/ReportsAcidentes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        r.id AS accident_id,
        r.description AS accident_description,
        r.latitude AS accident_latitude,
        r.longitude AS accident_longitude,
        r.status AS accident_status,
        r."registerDate" AS accident_register_date,
        r."lastUpdate" AS accident_last_update,
        u.name AS user_name,
        u.lastname AS user_lastname,
        i.id AS institution_id,
        i.name AS institution_name,
        it.name AS institution_type, 
        i.status AS institution_status,
        img.url AS image_url,
        at.id AS accident_type_id,
        at.name AS accident_type_name
      FROM public."Report" r
      LEFT JOIN public."User" u ON r."idUser" = u.id
      LEFT JOIN public."AssigmentAccident" aa ON r.id = aa."idReport"
      LEFT JOIN public."Institution" i ON aa."idInstitution" = i.id
      LEFT JOIN public."InstitutionType" it ON i."idInstitutionType" = it.id
      LEFT JOIN public."Image" img ON img."idReport" = r.id
      LEFT JOIN public."AccidentReport" ar ON r.id = ar."idReport"
      LEFT JOIN public."AccidentType" at ON ar."idAccidentType" = at.id
      WHERE r.id = $1
      ORDER BY r.id;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Accidente no encontrado.' });
    }

    // Procesar datos aquí (similar a lo mostrado anteriormente)
    const accident = { /* Procesa los datos */ };
    res.status(200).json(accident);
  } catch (error) {
    console.error('Error al obtener el accidente:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});


//asigana instituciones

app.post('/assignInstitution', async (req, res) => {
  const { idReport, institutions } = req.body;

  console.log("Datos recibidos:", { idReport, institutions });

  if (!idReport || !Array.isArray(institutions) || institutions.length === 0) {
    return res.status(400).json({ error: 'idReport e institutions son obligatorios y deben ser válidos.' });
  }

  try {
    // Valida primero que idReport exista
    const reportExists = await pool.query(`SELECT id FROM public."Report" WHERE id = $1`, [idReport]);
    if (reportExists.rowCount === 0) {
      return res.status(400).json({ error: `El idReport ${idReport} no existe.` });
    }

    // Valida que todas las instituciones existan
    const institutionCheckQuery = `
      SELECT id FROM public."Institution" WHERE id = ANY($1::int[])
    `;
    const institutionsCheck = await pool.query(institutionCheckQuery, [institutions]);

    if (institutionsCheck.rowCount !== institutions.length) {
      return res.status(400).json({ error: 'Una o más instituciones no existen.' });
    }

    // Inserta los datos
    const values = institutions.map(idInstitution => `(${idReport}, ${idInstitution}, 1, NOW(), NOW())`).join(',');
    const query = `
      INSERT INTO public."AssigmentAccident" ("idReport", "idInstitution", status, "registerDate", "lastUpdateDate")
      VALUES ${values}
      RETURNING *;
    `;
    const result = await pool.query(query);

    res.status(201).json({
      message: 'Instituciones asignadas exitosamente.',
      assignments: result.rows,
    });
  } catch (error) {
    console.error('Error al asignar las instituciones:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});



//view institution 
app.get('/institutionsView', async (req, res) => {
  try {
    const query = `
       SELECT 
        i.id AS institution_id,
        i.name AS institution_name,
        i.phone AS institution_phone,
        i.address AS institution_address,
        i.status AS institution_status,
        c.name AS city_name,
        it.name AS institution_type
      FROM public."Institution" i
      LEFT JOIN public."InstitutionType" it ON i."idInstitutionType" = it.id
      LEFT JOIN public."County" c ON i."idCounty" = c.id
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Set the API on the port 3005
app.listen(3005, () => {
    console.log('Server is running on port 3005');
  });

module.exports = pool;