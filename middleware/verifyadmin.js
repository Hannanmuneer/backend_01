const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token missing, Access denied" });
        }

        const token = authHeader.split(" ")[1];

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Sirf admin update ya delete kar sakta hai!" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyAdmin;