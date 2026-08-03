import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No autorizado. Token no proporcionado."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado."
        });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado. Se requiere rol de administrador."
        });
    }
    next();
};

