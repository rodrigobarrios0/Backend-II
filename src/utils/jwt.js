import jwt from "jsonwebtoken";

export const generateToken = (user) => {

    const payload = {
        userId: user._id,
        role: user.role
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

};

export default generateToken;