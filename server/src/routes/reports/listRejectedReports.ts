import {FastifyReply, FastifyRequest} from 'fastify';

import Report, {ReportStatus} from '../../models/Report.js';

const listRejectedReportsHandler = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  const reports = await Report.find({
    status: ReportStatus.REJECTED,
  });

  return res.status(200).send({
    data: reports,
    success: true,
  });
};

export default listRejectedReportsHandler;
