export class Event {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  startTime: Date;
  endTime: Date;
  googleCalendarEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
