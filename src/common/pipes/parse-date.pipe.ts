import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: Record<string, any>, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) return value;
    const dateFields = ['date', 'startTime', 'endTime'];
    const transformed = { ...value };
    for (const field of dateFields) {
      if (
        transformed[field] !== undefined &&
        typeof transformed[field] === 'string'
      ) {
        const parsed = new Date(transformed[field]);
        if (isNaN(parsed.getTime())) {
          throw new BadRequestException(
            `Field '${field}' must be a valid date string`,
          );
        }
        transformed[field] = parsed;
      }
    }
    return transformed;
  }
}
