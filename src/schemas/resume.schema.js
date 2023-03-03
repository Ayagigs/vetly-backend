import { z } from "zod";

const resumeSchema = z.object({
    firstname: z.string(),
    lastname:z.string(),
    DOB:z.string(),
    email: z.string().email(),
    phone_number: z.string().min(10).max(20),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    occupation:z.string(),
    
    summary: z.string().max(500),
    work_experience: z.string().max(1000),
    education: z.string().max(1000),
    skills: z.string().max(500),
    user_type: z.enum(["applicant","business", "admin"], {
        required_error: "Add user type to query body"
    })
  });

  export default resumeSchema;