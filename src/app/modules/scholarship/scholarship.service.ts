import { prisma } from '../../../shared/prisma';
import { FileUploadHelper } from '../../../shared/fileUploader';
import { Prisma } from '@prisma/client';

interface ICloudinaryUploadResult {
  secure_url: string;
}

const REQUIRED_FILE_FIELDS = ['photo', 'marksheet', 'recommendation'] as const;

const uploadToCloudinary = async (file: Express.Multer.File) => {
  return await FileUploadHelper.uploadToCloudinary(file) as ICloudinaryUploadResult;
};

const createApplication = async (
  payload: Prisma.EducationAidApplicationCreateInput,
  files?: Express.Multer.File[]
) => {
  const uploadedFields = new Set(files?.map((file) => file.fieldname));
  const missingFields = REQUIRED_FILE_FIELDS.filter((field) => !uploadedFields.has(field));

  if (missingFields.length) {
    throw new Error(`Missing required document(s): ${missingFields.join(', ')}`);
  }

  if (files && files.length) {
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file);
      if (file.fieldname === 'photo') payload.photoUrl = uploaded.secure_url;
      if (file.fieldname === 'marksheet') payload.marksheetUrl = uploaded.secure_url;
      if (file.fieldname === 'recommendation') payload.recommendationUrl = uploaded.secure_url;
    }
  }

  return await prisma.educationAidApplication.create({
    data: payload,
  });
};

const getAllApplications = async () => {
  return await prisma.educationAidApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const getSingleApplication = async (id: string) => {
  const application = await prisma.educationAidApplication.findUnique({
    where: { id },
  });
  if (!application) throw new Error('Scholarship application not found');
  return application;
};

const updateApplication = async (
  id: string,
  payload: Prisma.EducationAidApplicationUpdateInput,
  files?: Express.Multer.File[]
) => {
  const existing = await prisma.educationAidApplication.findUnique({ where: { id } });
  if (!existing) throw new Error('Scholarship application not found');

  if (files && files.length) {
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file);
      if (file.fieldname === 'photo') payload.photoUrl = uploaded.secure_url;
      if (file.fieldname === 'marksheet') payload.marksheetUrl = uploaded.secure_url;
      if (file.fieldname === 'recommendation') payload.recommendationUrl = uploaded.secure_url;
    }
  }

  return await prisma.educationAidApplication.update({
    where: { id },
    data: payload,
  });
};

const deleteApplication = async (id: string) => {
  const existing = await prisma.educationAidApplication.findUnique({ where: { id } });
  if (!existing) throw new Error('Scholarship application not found');
  return await prisma.educationAidApplication.delete({ where: { id } });
};

export const ScholarshipService = {
  createApplication,
  getAllApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
};