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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';
import { StripUndefinedPipe } from '../common/pipes/strip-undefined.pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  private extractAccessToken(req: Request): string | undefined {
    const authHeader = req.headers['authorization'];
    if (
      authHeader &&
      typeof authHeader === 'string' &&
      authHeader.startsWith('Bearer ')
    ) {
      return authHeader.substring(7);
    }
    return undefined;
  }

  private extractIDPToken(req: Request): string | undefined {
    const idpToken = req.headers['x-google-token'];
    if (idpToken && typeof idpToken === 'string') {
      return idpToken;
    }
    return undefined;
  }

  @Post()
  create(
    @Body(ParseDatePipe, StripUndefinedPipe) createEventDto: CreateEventDto,
    @Req() req: Request,
  ) {
    //const accessToken = this.extractAccessToken(req);
    const idpToken = this.extractIDPToken(req);
    return this.eventsService.create(createEventDto, idpToken);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    console.log(
      `GET /events/${id} access token:`,
      req.headers['authorization'],
    );
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
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
  remove(@Param('id') id: string, @Req() req: Request) {
    const idpToken = this.extractIDPToken(req);
    return this.eventsService.remove(id, idpToken);
  }
}
