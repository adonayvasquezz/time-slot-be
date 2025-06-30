import { Injectable, BadRequestException } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
  };
}

@Injectable()
export class GoogleCalendarService {
  private getCalendarClient(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async createEvent(
    accessToken: string,
    event: GoogleCalendarEvent,
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const calendar = this.getCalendarClient(accessToken);
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event: ', error);
      throw new BadRequestException(
        `Error creating Google Calendar event: ${error.message}`,
      );
    }
  }

  async updateEvent(
    accessToken: string,
    eventId: string,
    event: Partial<GoogleCalendarEvent>,
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const calendar = this.getCalendarClient(accessToken);

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: event,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(
        `Error updating Google Calendar event: ${error.message}`,
      );
    }
  }

  async deleteEvent(accessToken: string, eventId: string): Promise<void> {
    try {
      const calendar = this.getCalendarClient(accessToken);

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
    } catch (error) {
      throw new BadRequestException(
        `Error deleting Google Calendar event: ${error.message}`,
      );
    }
  }

  async getEvent(accessToken: string, eventId: string): Promise<any> {
    try {
      const calendar = this.getCalendarClient(accessToken);

      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(
        `Error getting Google Calendar event: ${error.message}`,
      );
    }
  }

  async listEvents(
    accessToken: string,
    timeMin?: string,
    timeMax?: string,
  ): Promise<any[]> {
    try {
      const calendar = this.getCalendarClient(accessToken);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      throw new BadRequestException(
        `Error listing Google Calendar events: ${error.message}`,
      );
    }
  }

  async syncEventToGoogleCalendar(
    accessToken: string,
    localEvent: any,
  ): Promise<calendar_v3.Schema$Event> {
    const googleEvent: GoogleCalendarEvent = {
      summary: localEvent.title,
      description: localEvent.description,
      start: {
        dateTime: localEvent.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: localEvent.endTime,
        timeZone: 'UTC',
      },
      reminders: {
        useDefault: true,
      },
    };

    if (localEvent.googleCalendarEventId) {
      return this.updateEvent(
        accessToken,
        localEvent.googleCalendarEventId,
        googleEvent,
      );
    } else {
      return this.createEvent(accessToken, googleEvent);
    }
  }

  async checkConflictingEvents(
    accessToken: string,
    startTime: string,
    endTime: string,
    excludeEventId?: string,
  ): Promise<any[]> {
    try {
      const calendar = this.getCalendarClient(accessToken);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startTime,
        timeMax: endTime,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      const conflictingEvents = events.filter((event) => {
        if (excludeEventId && event.id === excludeEventId) {
          return false;
        }

        if (!event.start || !event.end) {
          return false;
        }

        const eventStart = new Date(
          event.start.dateTime || event.start.date || '',
        );
        const eventEnd = new Date(event.end.dateTime || event.end.date || '');
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);

        if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) {
          return false;
        }

        return (
          (eventStart < newEnd && eventEnd > newStart) ||
          (eventStart >= newStart && eventStart < newEnd) ||
          (eventStart <= newStart && eventEnd >= newEnd)
        );
      });

      return conflictingEvents;
    } catch (error) {
      console.error('Error checking Google Calendar conflicts:', error);

      return [];
    }
  }
}
