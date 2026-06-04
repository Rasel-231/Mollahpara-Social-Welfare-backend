import prisma from '../../../shared/prisma';

const createEvent = async (payload: any) => {
  const event = await prisma.upcomingEvent.create({ data: payload });
  return event;
};

const getAllEvents = async () => {
  const events = await prisma.upcomingEvent.findMany({
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
  if (!event) throw new Error('Event not found');
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
