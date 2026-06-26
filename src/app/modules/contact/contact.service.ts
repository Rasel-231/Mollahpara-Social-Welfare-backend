import { prisma } from '../../../shared/prisma';

const createContact = async (payload: any) => {
  const contact = await prisma.contact.create({
    data: payload,
  });

  return contact;
};

const getAllContacts = async () => {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return contacts;
};

const getContactById = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new Error('Contact not found');
  }

  return contact;
};

const updateContact = async (id: string, payload: any) => {
  const existing = await prisma.contact.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Contact not found');
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: payload,
  });

  return contact;
};

const deleteContact = async (id: string) => {
  const existing = await prisma.contact.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Contact not found');
  }

  const contact = await prisma.contact.delete({
    where: { id },
  });

  return contact;
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
