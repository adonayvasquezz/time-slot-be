import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class StripUndefinedPipe implements PipeTransform {
  transform(value: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(value).filter(([_, val]) => val !== undefined),
    );
  }
}
