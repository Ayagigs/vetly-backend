import mongoose, { model, Schema } from "mongoose";
// import applicantSchema from "../schemas/applicant.schema";

const vettingSchema = new Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    resume_id: {
        type: mongoose.Schema.ObjectId,
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
        enum: ["pending", "failed", "success"],
        default: "pending"
    },

},
    // {
    //     applicant: {
    //         applicantSchema
    //     }
    // },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    });

const Vetting = model("vetting", vettingSchema);

export default Vetting;