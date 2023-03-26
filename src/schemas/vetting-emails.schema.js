import { z } from "zod";
// import validator from "validator";

const vettingEmailsSchema = z.object({
    resume_id: z.string().optional(),
    emails: z.array(
        z.string().email()
    ),
    // applicant_id: z.string().refine(validator.isMongoId, { message: "Invalid Id" })
});

export default vettingEmailsSchema;