import { z } from "zod";

const resumeSchema = z.object({
    personal_information: z.object({
        firstname: z.string(),
        lastname: z.string(),
        dob: z.union([z.date(), z.string()]),
        email_address: z.string().email(),
        phone_number: z.string().min(10).max(20),
        address: z.string(),
        city: z.string(),
        country: z.string(),
    }).optional(),

    work_experience: z.array(
        z.object({
            occupation: z.string(),
            company: z.string(),
            email_address: z.string().email(),
            phone_number: z.string().min(10).max(20),
            city: z.string(),
            country: z.string(),
            from: z.coerce.date(),
            to: z.coerce.date(),
            main_activities: z.string().max(1000),
        })
    ).optional(),

    education_training: z.array(
        z.object({
            experience: z.string(),
            organization: z.string(),
            website: z.string(),
            city: z.string(),
            country: z.string(),
            from: z.coerce.date(),
            to: z.coerce.date(),
            final_grade: z.string(),
            main_activities: z.string().max(1000),
        })
    ).optional(),

    personal_skill: z.array(
        z.string()
    ).optional(),

    saved: z.boolean().optional()

});

export default resumeSchema;