import {FastifyReply, FastifyRequest} from 'fastify';

import User from '../../models/User.js';
import {GenericResponseBodyType} from '../../schemas/generics.schema.js';
import {UserResponseBodyType} from '../../schemas/user.schema.js';

const meHandler = async (
  req: FastifyRequest<{
    Reply: GenericResponseBodyType | UserResponseBodyType;
  }>,
  res: FastifyReply
) => {
  const user = await User.findById(req.session.user, {
    projection: {
      email: 1,
      name: 1,
    },
  });

  if (!user || user.deleted) {
    await req.session.destroy();
    return res.status(401).send({
      msg: 'You are not authorized to access this endpoint',
      success: false,
    });
  }
  if (req.routeOptions.url === '/api/users/me/full') {
    const data = await User.findById(req.session.user, {
      projection: {
        password: 0,
      },
    });
    return res.status(200).send({data, success: true});
  }

  return res.status(200).send({
    data: user,
    success: true,
  });
};

export default meHandler;
