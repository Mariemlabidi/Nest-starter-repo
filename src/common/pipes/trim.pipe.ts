import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (value === null || value === undefined) return value;

    const trim = (v: any): any => {
      if (typeof v === 'string') return v.trim();
      if (Array.isArray(v)) return v.map(trim);
      if (v && typeof v === 'object') {
        const out: any = {};
        for (const [k, val] of Object.entries(v)) {
          out[k] = trim(val);
        }
        return out;
      }
      return v;
    };

    return trim(value);
  }
}
