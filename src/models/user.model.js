import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullname: String,
    local: {
        email: String,
        email_verified:{
            type: Boolean,
            default: false
        },
        password: String,
    },
    google: {
        id: String,
        email: String,
    },
    github: {
        id: String,
        email: String,
    },
    linkedin: {
        id: String,
        email: String,
    },
    userType: {
        type: String,
        enum : ["applicant","business", "admin"],
        default: "applicant"
    },
},
{
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at" 
    }
});

userSchema.pre("save", async function  (next) {
    if (!this.isModified("local.password")) next();
    const salt = await bcrypt.genSalt(10);
    this.local.password = await bcrypt.hash(this.local.password, salt);
});

userSchema.methods.passwordMatch = async function (password) {
    return await bcrypt.compare(password, this.local.password);
};

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

const User = model("user", userSchema);

export default User;