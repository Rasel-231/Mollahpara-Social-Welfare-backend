import { z } from 'zod';

const create = z.object({
  body: z.object({
    studentName: z.string().min(1, 'Student name is required'),
    guardianName: z.string().min(1, 'Guardian name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    nidOrBirthReg: z.string().min(1, 'NID/Birth registration is required'),
    institutionName: z.string().min(1, 'Institution name is required'),
    className: z.string().min(1, 'Class name is required'),
    rollNumber: z.string().min(1, 'Roll number is required'),
    gpa: z.coerce.number().positive('GPA must be positive').max(5, 'GPA cannot exceed 5'),
    monthlyIncome: z.string().min(1, 'Monthly income is required'),
    currentAddress: z.string().min(1, 'Current address is required'),
  }),
});

const update = z.object({
  body: z.object({
    studentName: z.string().optional(),
    guardianName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    nidOrBirthReg: z.string().optional(),
    institutionName: z.string().optional(),
    className: z.string().optional(),
    rollNumber: z.string().optional(),
    gpa: z.coerce.number().positive('GPA must be positive').max(5, 'GPA cannot exceed 5').optional(),
    monthlyIncome: z.string().optional(),
    currentAddress: z.string().optional(),
    photoUrl: z.string().optional(),
    marksheetUrl: z.string().optional(),
    recommendationUrl: z.string().optional(),
  }),
});

export const ScholarshipValidation = { create, update };