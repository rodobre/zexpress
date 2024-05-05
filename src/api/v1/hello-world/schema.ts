import { z } from 'zod'

export const CreateSocials = z.object({
  socials: z.object({
    phoneNumber: z
      .string()
      .regex(
        /^(\+?[0-9]{1,3})?[-.●]?([0-9]{3})[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/,
        'The phone number is not valid'
      ),
    shortDescription: z.string().max(512),
    publicEmail: z.string().email().max(256),
    website: z.union([z.string().length(0), z.string().url().max(512)]),
    facebook: z.union([
      z.string().length(0),
      z
        .string()
        .url()
        .regex(
          /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_](?:[a-zA-Z0-9_]|(?:\.(?!\.))){1,50}(\/)?/,
          'Invalid Facebook account'
        )
        .max(512),
    ]),
    instagram: z.union([
      z.string().length(0),
      z
        .string()
        .url()
        .regex(
          /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_](?:[a-zA-Z0-9_]|(?:\.(?!\.))){1,30}(\/)?/,
          'Invalid Instagram account'
        )
        .max(512)
        .optional(),
    ]),
    twitter: z.union([
      z.string().length(0),
      z
        .string()
        .url()
        .regex(
          /https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_](?:[a-zA-Z0-9_]|(?:\.(?!\.))){1,15}(\/)?/,
          'Invalid Twitter account'
        )
        .max(512)
        .optional(),
    ]),
    linkedin: z.union([
      z.string().length(0),
      z
        .string()
        .url()
        .regex(
          /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-](?:[a-zA-Z0-9_-]|(?:\.(?!\.))){1,100}(\/)?/,
          'Invalid LinkedIn account'
        )
        .max(512)
        .optional(),
    ]),
  }),
})

export const AgencyFields = z.object({
  agency: z.object({
    name: z.string().max(256),
    description: z.string().max(4096),
    banner: z.string().url().max(512),
    avatar: z.string().url().max(512),
    address: z.string().max(512),
    district: z
      .string()
      .refine((str) => ['a', 'b'].includes(str), 'District is not valid'),
    lat: z.number().lte(90).gte(-90),
    lon: z.number().lte(180).gte(-180),
    socials: CreateSocials,
    taxUniqueId: z.string().min(8).max(10),
    registrationId: z.string().min(12).max(30),
    bankName: z.string().max(512),
    accountId: z
      .string()
      .regex(
        /^[A-Z]{2}[0-9]{2}[A-Z]{4}[A-z0-9]{16}$/,
        'IBAN account is not valid'
      ),
    hqCounty: z.string().max(512),
    hqCity: z.string().max(512),
    hqAddress: z.string().max(512),
  }),
})
