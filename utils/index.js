import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const generateToken = (
    payload,
    expiresIn
) => {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: expiresIn ?? "1d",
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};
