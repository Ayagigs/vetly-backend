import { model, Schema } from "mongoose";
import crypto from "crypto";
import moment from "moment";

const tokenSchema = new Schema({
    key: {
        type: String,
        default: () => crypto.randomBytes(16).toString("hex"),
        required: true
    },
    creator_id: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    expires: {
        type: Date,
        default: () => moment().add(15, "m").toDate()
    }
});

tokenSchema.methods.flagUsed = async function () {
    await Token.findOneAndUpdate({_id: this.id}, { used: true });
};

tokenSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

const Token = model("tokens", tokenSchema);

export default Token;