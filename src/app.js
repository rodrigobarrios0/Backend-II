import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";

import "./strategies/index.js";

import authRoutes from "./routes/auth.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 14 * 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoutes);



export default app;