import { Router } from "express";

import {
    register,
    login,
    logout,
    getProfile,
    getAdmin,
    getSession,
    githubLogin
} from "../controllers/auth.controller.js";

import {
    authenticate,
    authorizeAdmin
} from "../middlewares/auth.middlewares.js";

import passport from "../strategies/index.js";

const router = Router();

router.post("/register", register);

router.post(
    "/login",
    passport.authenticate("local"),
    login
);

router.post("/logout", authenticate, logout);

router.get("/profile", authenticate, getProfile);

router.get("/admin", authenticate, authorizeAdmin, getAdmin);

router.get("/session", authenticate, getSession);

router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"]
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github"),
    githubLogin
);


export default router;
