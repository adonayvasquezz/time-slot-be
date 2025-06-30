import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';
import { StripUndefinedPipe } from '../common/pipes/strip-undefined.pipe';
import {
  ApiCreateEventResponse,
  ApiGetEventsResponse,
  ApiGetEventResponse,
  ApiUpdateEventResponse,
  ApiDeleteEventResponse,
} from './decorators/api-responses.decorator';
import * as jwt from 'jsonwebtoken';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  private extractAccessToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (
      authHeader &&
      typeof authHeader === 'string' &&
      authHeader.startsWith('Bearer ')
    ) {
      return authHeader.substring(7);
    }
    throw new Error('Access token not found in request headers');
  }

  private extractIDPToken(req: Request): string {
    const idpToken = req.headers['x-google-token'];
    if (idpToken && typeof idpToken === 'string') {
      return idpToken;
    }
    throw new Error('IDP token not found in request headers');
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const decoded = jwt.decode(token) as { [key: string]: any } | null;
      return decoded?.sub;
    } catch {
      throw new Error('Invalid sub ID in access token');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiCreateEventResponse()
  @ApiBearerAuth()
  @ApiHeader({
    name: 'X-Google-Token',
    description: 'Google Calendar access token (optional)',
  })
  create(
    @Body(ParseDatePipe, StripUndefinedPipe) createEventDto: CreateEventDto,
    @Req() req: Request,
  ) {
    const accessToken = this.extractAccessToken(req);
    const externalUserId = this.extractUserIdFromToken(accessToken);
    const idpToken = this.extractIDPToken(req);
    return this.eventsService.create(createEventDto, externalUserId, idpToken);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events for the authenticated user' })
  @ApiGetEventsResponse()
  @ApiBearerAuth()
  findAll(@Req() req: Request) {
    const accessToken = this.extractAccessToken(req);
    const externalUserId = this.extractUserIdFromToken(accessToken);

    return this.eventsService.findAll(externalUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  @ApiGetEventResponse()
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiUpdateEventResponse()
  @ApiBearerAuth()
  @ApiHeader({
    name: 'X-Google-Token',
    description: 'Google Calendar access token (optional)',
  })
  update(
    @Param('id') id: string,
    @Body(ParseDatePipe, StripUndefinedPipe) updateEventDto: UpdateEventDto,
    @Req() req: Request,
  ) {
    const idpToken = this.extractIDPToken(req);
    return this.eventsService.update(id, updateEventDto, idpToken);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiDeleteEventResponse()
  @ApiBearerAuth()
  @ApiHeader({
    name: 'X-Google-Token',
    description: 'Google Calendar access token (optional)',
  })
  remove(@Param('id') id: string, @Req() req: Request) {
    const idpToken = this.extractIDPToken(req);
    return this.eventsService.remove(id, idpToken);
  }
}
