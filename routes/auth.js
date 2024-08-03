const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

//import database
const { getClient } = require('../config/database'); // Import the getClient function
// JWT_SECRET
const JWT_SECRET = 'vue-chat-api-2k24';
const client = getClient(); // Get the connected client

if (!client) {
    return res.status(500).json({
      status: false,
      message: 'Database client is not connected',
    });
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET,function(err,decoded) {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            req.user = decoded; // Attach decoded user to request object
            next();
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Function to authenticate user
const authenticateUser = async (email, password) => {
    // const query = 'SELECT id, email, password FROM users WHERE email = $1';
    // const values = [email];

    try {
        // const res = await client.query(query, values);
        const res = await client.user.findMany({
            where:{
                email:{
                    equals:email
                }
            }
        });
        if (res.length > 0) {
            const user = res[0];
            if (bcrypt.compareSync(password, user.password)) {
                return user;
            } else {
                return false;
            }
        }
    } catch (err) {
        console.error(err);
    }

    return null;
};

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    // console.log(user)
    if (user) {
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// Logout route (handled on client-side)
router.post('/logout', (req, res) => {
    // For stateless JWT, the client should delete the token
    res.json({ message: 'Logout successful' });
});

// Register route
router.post('/register', async (req, res) => {
    const { email, password,name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const uniqueCode = (new Date().getTime()).toString(36);
    
    try {
        await client.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
                code: uniqueCode,
                role_user: 'user',
            },
        })
        // await client.query(query, values);
        res.json({ message: 'Registration successful', code:uniqueCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/curr-user',verifyToken, async(req, res) => {
    if (req.user) {
        const result = await client.query('SELECT name,id,email,code,role_user FROM users WHERE id = $1', [req.user.id]);
        res.json({ user: result.rows[0] });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;