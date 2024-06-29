import {FastifyReply, FastifyRequest} from 'fastify';

import Report from '../../models/Report.js';
import User from '../../models/User.js';
import {CreateReportBodyType} from '../../schemas/report.schema.js';

const createReportHandler = async (
  req: FastifyRequest<{
    Body: CreateReportBodyType;
  }>,
  res: FastifyReply
) => {
  const {description, images, lat, long} = req.body;
  console.log(req.session.user);
  const user = await User.findById(req.session.user);
  if (!user) {
    return res.status(401).send({msg: 'User not found', success: false});
  }

  const report = new Report({
    description,
    images,
    lat,
    long,
    user: user._id,
  });
  await report.save();

  return res.status(200).send({
    data: report,
    success: true,
  });
};

export default createReportHandler;
