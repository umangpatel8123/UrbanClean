import {FastifyPluginAsync} from 'fastify';

import createReportHandler from '../routes/reports/createReport.js';
import listCompletedReportsHandler from '../routes/reports/listCompletedReports.js';
import listPendingReportsHandler from '../routes/reports/listPendingReports.js';
import listRejectedReportsHandler from '../routes/reports/listRejectedReports.js';
import listWorkingReportsHandler from '../routes/reports/listWorkingReportsHandler.js';
import {CreateReportBodyType} from '../schemas/report.schema.js';

const garbageCollectorRouter: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Body: CreateReportBodyType;
  }>('/', createReportHandler);

  fastify.get('/', listPendingReportsHandler);
  fastify.get('/my', listPendingReportsHandler);
  fastify.get('/completed', listCompletedReportsHandler);
  fastify.get('/working', listWorkingReportsHandler);
  fastify.get('/rejected', listRejectedReportsHandler);
};

export default garbageCollectorRouter;
