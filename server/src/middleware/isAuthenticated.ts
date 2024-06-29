import {FastifyReply, FastifyRequest} from 'fastify';

const isAuthenticated = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.session.user) {
    return res.status(401).send({
      msg: 'You are not authorized to access this endpoint',
      success: false,
    });
  }
};

export default isAuthenticated;
