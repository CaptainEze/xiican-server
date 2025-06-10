import { verifyToken } from "../utils/index.js";
import bcrypt from "bcryptjs";

export const AuthMiddleware = async (
    req,
    res,
    next
) => {
    const authCookie = req.cookies.auth;

    try {
        if(!authCookie) throw "No auth cookie";
        const decoded = verifyToken(authCookie);

        const isValid = await bcrypt.compare(req.headers["user-agent"], decoded.uaHash)
        if (!isValid) throw "Invalid user-agent";
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.redirect("/")
    }
};
