import {FastifyReply, FastifyRequest} from 'fastify';

import {GenericResponseBodyType} from '../../schemas/generics.schema.js';

const logoutHandler = async (
  req: FastifyRequest<{
    Reply: GenericResponseBodyType;
  }>,
  res: FastifyReply
) => {
  if (!req.session.user) {
    await req.session.destroy();
    return res.status(400).send({
      msg: 'You are not authorized to perform this action',
      success: false,
    });
  }
  await req.session.destroy();
  return res.status(200).send({
    msg: 'You have been logged out',
    success: true,
  });
};

export default logoutHandler;
