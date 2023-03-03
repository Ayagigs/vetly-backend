import { model, Schema } from "mongoose";

const resumeSchema = new Schema ({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    personal_information: [
       {
            firstname: String,
            lastname: String,
            DOB: String,
            email_address: String,
            phone_number: Number,
            address: String,Number,
            city: String,Number,
            country: String, 
        },
    ],

    work_experience:[
        {
          occupation:String,
          company: String,
          email_address: String,
          phone_number: Number,
          city: String,
          country: String, 
          from: Date,
          to: Date,
          main_activities: String,
        },  
    ],

    education_training: [
        {
            education_training_experience: String,
            organization_providing_education_training: String,
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
        {
            personal_skills: String,
        },
    ],
    userType: {
        type: String,
        enum : ["applicant","business", "admin"],
        default: "applicant"
    },

},
{
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at" ,
        toJSON: {virtuals: true}
    }
    
});

const Resume = model("resume", resumeSchema);

export default Resume;