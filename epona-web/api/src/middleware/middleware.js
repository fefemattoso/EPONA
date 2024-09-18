require('dotenv').config();
const jwt = require('jsonwebtoken');

const validaAcesso = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        req.usuarioId = decoded.id;
        next();
    });
};

module.exports = validaAcesso;
