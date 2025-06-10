import User from "../models/user.js";

export const dashboard = (req, res) =>{
    res.render("dashboard")
}
export const setup = (req, res) => {
    res.render("setup", {error: null});
}
export const setupPost = async (req, res) => {
    const { pin, cpin } = req.body;
    try {
        if (!(pin && cpin)) {
            throw "All fields are required";
        }
        if (pin !== cpin) {
            throw "Pins do not match";
        }
        if (pin.length !== 6) {
            throw "Pin must be 6 characters long";
        }
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) throw "User not found";

        user.pin = pin;
        await user.save();

        res.redirect("/dashboard");
    } catch (error) {
        return res.render("setup", { error });
    }
}