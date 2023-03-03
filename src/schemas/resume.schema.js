import { z } from "zod";

const resumeSchema = z.object({
    user_type: z.enum(["applicant","business", "admin"], {
        required_error: "Add user type to query body"
    }),
    personal_information: z.array(
        z.object({
            firstname: z.string(),
            lastname:z.string(),
            DOB:z.string().date(),
            email_address: z.string().email(),
            phone_number: z.string().min(10).max(20),
            address: z.string(),
            city: z.string(),
            country: z.string(), 
        })
    ),

    work_experience:z.array(
      z.object({
        occupation:z.string(),
        company: z.string(),
        company_email_address: z.string().email(),
        company_phone_number: z.string().min(10).max(20),
        city: z.string(),
        country: z.string(), 
        from:z.string().date(),
        to:z.string().date(),
        main_activities: z.string().max(1000),
      })  
    ),
   
    education_training:z.array(
        z.object({
            education_training_experience:z.string(),
            organization_providing_education_training: z.string(),
            website:z.string(),
            city: z.string(),
            country: z.string(),
            from:z.string().date(),
            to:z.string().date(),
            final_grade:z.string(),
            main_activities: z.string().max(1000),
        })
    ),
    personal_skill:z.array(
        z.object({
            personal_skills: z.string().max(1000),
        })
    ),
 
  });

  export default resumeSchema;