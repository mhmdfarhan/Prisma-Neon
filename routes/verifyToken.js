const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

function verifyToken(req, res, next) {
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

router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET,function(err,decoded) {
            if (err) return res.status(403).json({ message: 'Invalid tokens' });
            return res.status(200).json({ message: 'valid token' });
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid token' });
    }
  });
  
// module.exports = router;
module.exports = {
    verifyToken: () => verifyToken,
};