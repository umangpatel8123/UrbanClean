import {FastifyReply, FastifyRequest} from 'fastify';

import User from '../../models/User.js';

export const allUsersHandler = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  const users = await User.find({deleted: false});
  return res.status(200).send({
    success: true,
    users,
  });
};

export const singleUserHandler = async (
  req: FastifyRequest<{
    Params: {id: string};
  }>,
  res: FastifyReply
) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({
      msg: 'No user found',
      success: false,
    });
  }
  return res.status(200).send({
    success: true,
    user,
  });
};

export const deleteUserHandler = async (
  req: FastifyRequest<{
    Params: {id: string};
  }>,
  res: FastifyReply
) => {
  const {id} = req.params;
  const user = await User.findById(id);
  if (!user || user.deleted) {
    return res.status(404).send({
      msg: 'User not found',
      success: false,
    });
  }
  await User.updateOne(
    {_id: user._id},
    {
      $set: {
        deleted: true,
      },
    }
  );
  return res.status(200).send({
    msg: 'User deleted',
    success: true,
  });
};

export default allUsersHandler;
