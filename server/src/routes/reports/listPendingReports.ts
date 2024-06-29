import {FastifyReply, FastifyRequest} from 'fastify';

import Report, {ReportStatus} from '../../models/Report.js';

const listPendingReportsHandler = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  const reports = await Report.find({
    status: ReportStatus.PENDING,
  });

  return res.status(200).send({
    data: reports,
    success: true,
  });
};

export default listPendingReportsHandler;
