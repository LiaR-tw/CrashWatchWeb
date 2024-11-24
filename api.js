const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const authenticateToken = require("./middleware/authenticateToken");
const userRoutes = require("./routes/userRoutes");


require('dotenv').config();

const jwt = require("jsonwebtoken");

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






//Set the API on the port 3005
app.listen(3005, () => {
    console.log('Server is running on port 3005');
  });

module.exports = pool;