const {z} = require('zod')

const signupSchema = z.object({
    username: z.string().min(3,"Username should be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password should be at least 6 characters long")
})

const googleSchema=z.object({
    username: z.string().min(3,"Username should be at least 3 characters long"),
    password: z.string().min(6, "Password should be at least 6 characters long")
})

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password should be at least 6 characters long")
});

module.exports = {signupSchema,loginSchema,googleSchema}