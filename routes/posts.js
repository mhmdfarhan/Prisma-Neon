// routes/posts.js
const express = require('express');
const router = express.Router();
const { getClient } = require('../config/database'); // Import the getClient function
// const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

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


router.get('/',verifyToken, async (req, res) => {
  try {
    // const result = await client.$queryRaw`SELECT * FROM users ORDER BY id DESC`;
    const result = await client.user.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    // console.log(result)
    return res.status(200).json({
      status: true,
      message: 'List Data Posts',
      data: result,
    });
  } catch (err) {
    console.error('Database query error', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;
