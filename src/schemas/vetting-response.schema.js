import { z } from "zod";

const VettingResponseSchema = z.object({
    token: z.string().min(1, "Token is required"),
    status: z.enum(["success","failed"], {
        required_error: "Status is required"
    }),
    reason: z.string().optional()
});

export default VettingResponseSchema;