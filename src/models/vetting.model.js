import { model, Schema } from "mongoose";

const vettingSchema = new Schema({
    creator_id:  {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending","failed", "success"],
        default: "pending"
    }
},
{
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at",
    }
});

const Vetting = model("vetting", vettingSchema);

export default Vetting;