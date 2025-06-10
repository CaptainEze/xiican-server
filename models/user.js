import {Schema, model} from "mongoose"
import { v4 } from "uuid"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        default: v4()
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    id: false
});

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User;

