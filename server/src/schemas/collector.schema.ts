import {Static, Type} from '@sinclair/typebox';

import {GarbageCollectorStatus} from '../models/GarbageCollector.js';
import {ObjectIdString} from './generics.schema.js';

export const CollectorData = Type.Object({
  _id: ObjectIdString,
  createdAt: Type.String(),
  deleted: Type.Boolean(),
  lat: Type.Number(),
  long: Type.Number(),
  status: Type.Enum(GarbageCollectorStatus),
  updatedAt: Type.String(),
  user: ObjectIdString,
});

export type CollectorDataType = Static<typeof CollectorData>;
