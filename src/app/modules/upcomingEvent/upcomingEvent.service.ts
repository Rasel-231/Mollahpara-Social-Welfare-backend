import prisma from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import AppError from '../../../errors/AppError';

const createEvent = async (payload: any) => {
  const event = await prisma.upcomingEvent.create({ data: payload });
  return event;
};

const getAllEvents = async (params?: { searchTerm?: string }) => {
  const { searchTerm } = params || {};
  const andConditions: Record<string, unknown>[] = [];
  const searchCondition = paginationHelper.searchFields(searchTerm, ['title', 'description', 'location']);
  if (searchCondition) andConditions.push(searchCondition);
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const events = await prisma.upcomingEvent.findMany({
    where,
    include: { creator: { select: { id: true, name: true } } },
    orderBy: { date: 'asc' },
  });
  return events;
};

const getEventById = async (id: string) => {
  const event = await prisma.upcomingEvent.findUnique({
    where: { id },
    include: { creator: { select: { id: true, name: true } } },
  });
  if (!event) throw new AppError(404, 'Event not found');
  return event;
};

const updateEvent = async (id: string, payload: any) => {
  const event = await prisma.upcomingEvent.update({
    where: { id },
    data: payload,
  });
  return event;
};

const deleteEvent = async (id: string) => {
  const event = await prisma.upcomingEvent.delete({ where: { id } });
  return event;
};

export const UpcomingEventService = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
