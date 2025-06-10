import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/index.js";


export const loginScreen = (req, res) => {
    res.render("login", {error: null});
}
export const registerScreen = (req, res) => {
    res.render("register", {error: null} );
}

export const register = async (req, res) => {
    const {userName, password, psk} = req.body;

    try {
        if (!(userName && password && psk)){
            throw "All fields are required";
        }
        if (psk != process.env.ACCESS_PIN){
            throw "Invalid Authorization key";
        }
        const exists = await User.findOne({userName});
        if(exists) throw `User name: ${userName}, already used`;
        
        const user = new User({
            userName, password
        });
        user.save();

        res.render("login",{ error: null})
        
    } catch (error) {
        return res.render("register", {error});
    }

    
}

export const login = async (req, res) => {
    const { userName, password} = req.body;
    try {
        if (!(userName && password)){
            throw "All fields are required";
        }
        const user = await User.findOne({userName});

        if (!user) throw `Invalid username: ${userName}`;
        
        const isMatch = await user.comparePassword(password);

        if (!isMatch) throw "Invalid login credentials";

        const uaHash = await bcrypt.hash(req.headers["user-agent"], 10);
        const token = generateToken({
            uaHash,
            userName: user.userName,
            uid: user.uid,
            pin: user.pin,
        },"2hr");

        res.cookie("auth", token, { httpOnly: true });
        // if (!user.pin) res.redirect("/setup");
        
        res.redirect("/dashboard");
    } catch (error) {
        return res.render("login", {error});
    }
    
}