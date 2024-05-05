import { z } from 'zod'

export const SamplePostSchema = z.object({
  user: z.object({
    phoneNumber: z.string().max(14, 'Phone number is invalid'),
    email: z
      .string()
      .email()
      .max(256, 'Mail length cannot exceed 512 characters'),
    name: z.string().max(512, 'Name length cannot exceed 512 characters'),
    password: z
      .string()
      .max(512, 'Password length cannot exceed 512 characters'),
  }),
})

export const SamplePutSchema = z.object({
  id: z.coerce.number().int().gte(0),
})
