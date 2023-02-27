import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullname: String,
    local: {
        email: String,
        email_verified:{
            type: Boolean,
        },
        password: {
            type: String,
            select: false,
        },
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

userSchema.pre(/^(updateOne|save|findOneAndUpdate)/, async function  (next) {
    const user = this;

    if (user?.local?.password) {
        if (user.isModified("local.password")) {
            const salt = await bcrypt.genSalt(10);
            user.local.password = await bcrypt.hash(user.local.password, salt);
        }
        return next();
    }
  
    if (user?._update?.local?.password) {
        const salt = await bcrypt.genSalt(10);
        user._update.local.password = await bcrypt.hash(user._update.local.password, salt);
    }
    next();
});

userSchema.methods.passwordMatch = async function (password) {
    const user = await User.findOne({_id: this.id}).select("local.password").exec();
    return await bcrypt.compare(password, user.local.password);
};

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.local.password;
    }
}); 

const User = model("user", userSchema);

export default User;