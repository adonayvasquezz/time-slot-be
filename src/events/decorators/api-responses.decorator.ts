import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Event } from '../entities/event.entity';

export const ApiCreateEventResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Event created successfully',
      type: Event,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 409,
      description: 'Event conflicts with existing events',
    }),
  );

export const ApiGetEventsResponse = () =>
  applyDecorators(
    ApiResponse({ status: 200, description: 'List of events', type: [Event] }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );

export const ApiGetEventResponse = () =>
  applyDecorators(
    ApiResponse({ status: 200, description: 'Event found', type: Event }),
    ApiResponse({ status: 404, description: 'Event not found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );

export const ApiUpdateEventResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Event updated successfully',
      type: Event,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Event not found' }),
    ApiResponse({
      status: 409,
      description: 'Event conflicts with existing events',
    }),
  );

export const ApiDeleteEventResponse = () =>
  applyDecorators(
    ApiResponse({ status: 204, description: 'Event deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Event not found' }),
  );
