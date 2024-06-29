import {Static, Type} from '@sinclair/typebox';

export const GenericResponseBody = Type.Object({
  msg: Type.String(),
  success: Type.Boolean(),
});

export type GenericResponseBodyType = Static<typeof GenericResponseBody>;

export const ObjectIdString = Type.String({
  maxLength: 24,
  minLength: 24,
});

export const UUIDString = Type.String({
  maxLength: 36,
  minLength: 36,
  // format: 'uuid',
});
