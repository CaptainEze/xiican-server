import mongoose from "mongoose";

const dbConn = async () => {
    mongoose
        .connect(process.env.MONGODB_URI, {})
        .then(() => {
            console.log("DB connected")
        })
        .catch((err) => {
            throw (err);
        });
};


export default dbConn;