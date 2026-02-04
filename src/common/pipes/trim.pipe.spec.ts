import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {
  const pipe = new TrimPipe();

  it('trims a plain string', () => {
    expect(pipe.transform('  hello  ', { type: 'body', metatype: String, data: '' })).toBe('hello');
  });

  it('trims nested object properties and arrays', () => {
    const input = { a: ' x ', b: { c: ' y ' }, d: [' z ', ' w '] };
    expect(pipe.transform(input, { type: 'body', metatype: undefined, data: '' })).toEqual({ a: 'x', b: { c: 'y' }, d: ['z', 'w'] });
  });

  it('does not modify non-string values', () => {
    expect(pipe.transform(123, { type: 'param', metatype: Number, data: '' })).toBe(123);
  });

  it('handles null and undefined safely', () => {
    expect(pipe.transform(null, { type: 'body', metatype: undefined, data: '' })).toBeNull();
    expect(pipe.transform(undefined, { type: 'body', metatype: undefined, data: '' })).toBeUndefined();
  });
});
