import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "El email ya está registrado"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });

    }

};

    export const login = (req, res) => {
        const user = req.user;

        req.login(user, (error) => {
            if (error) {
                return res.status(500).json({
                success: false,
                message: "Error al iniciar la sesión."
        });
    }   

        const token = generateToken(user);

        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};

export const getProfile = (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Perfil obtenido correctamente",
        user: req.user
    });
};

export const getSession = (req, res) => {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: "No hay sesión activa."
        });
    }

    return res.status(200).json({
    success: true,
    message: "Sesión activa.",
    user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    }
});

};

export const getAdmin = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Acceso a ruta de administrador concedido",
        user: req.user
    });
};

export const logout = (req, res) => {

    req.logout((error) => {

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error al cerrar sesión."
            });
        }

        req.session.destroy(() => {

            res.clearCookie("authToken");

            return res.status(200).json({
                success: true,
                message: "Sesión cerrada correctamente."
            });

        });

    });

};

export const githubLogin = (req, res) => {

    const user = req.user;

    const token = generateToken(user);

    res.cookie("authToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: "Login con GitHub exitoso",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
