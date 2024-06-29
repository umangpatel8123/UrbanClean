import {Static, Type} from '@sinclair/typebox';

import {ReportStatus} from '../models/Report.js';
import {ObjectIdString} from './generics.schema.js';

export const ReportData = Type.Object({
  _id: ObjectIdString,
  createdAt: Type.String(),
  deleted: Type.Boolean(),
  description: Type.String(),
  images: Type.Array(Type.String()),
  lat: Type.Number(),
  long: Type.Number(),
  status: Type.Enum(ReportStatus),
  updatedAt: Type.String(),
});

export type ReportDataType = Static<typeof ReportData>;

export const createReportBody = Type.Object({
  description: Type.String(),
  images: Type.Array(Type.String()),
  lat: Type.Number(),
  long: Type.Number(),
});

export type CreateReportBodyType = Static<typeof createReportBody>;
