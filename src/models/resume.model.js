import { model, Schema } from "mongoose";

const resumeSchema = new Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },

    personal_information: {
        firstname: String,
        lastname: String,
        dob: Date,
        email_address: String,
        phone_number: String,
        address: String,
        city: String,
        country: String,
    },

    work_experience: [
        {
            occupation: String,
            company: String,
            email_address: String,
            phone_number: String,
            city: String,
            country: String,
            from: Date,
            to: Date,
            main_activities: String,
        },
    ],

    education_training: [
        {
            experience: String,
            organization: String,
            website: String,
            city: String,
            country: String,
            from: Date,
            to: Date,
            final_grade: String,
            main_activities: String,
        },
    ],

    personal_skill: [
        String
    ],

    saved: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
        toJSON: { virtuals: true }
    }

});

resumeSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

const Resume = model("resumes", resumeSchema);

export default Resume;