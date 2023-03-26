import { z } from "zod";

const applicantSchema = z.object({
    fullname: z.string({
        required_error: "Fullname is required"
    }),
    job_title: z.string({
        required_error: "Job title is required"
    }),
    email: z.string({
        required_error: "Email is required"
    }).email()
});

export default applicantSchema;