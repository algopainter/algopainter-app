import { IError } from 'src/core/types';

export function isError(e: IError) {
  return e && e.message;
}
