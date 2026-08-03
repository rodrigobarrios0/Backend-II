import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const email = profile.emails?.[0]?.value;

if (!email) {
    return done(null, false, {
        message: "No se pudo obtener el email de GitHub."
    });
}

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || profile.username,
                        email,
                    });
                }

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;