import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },  
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if(!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!user.password) {
                    return done(null, false, {
                        message: "Este usuario se registró con OAuth. Usa el inicio de sesión de GitHub."
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if(!isMatch) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

export default passport;