import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { optionValidationSchema } from 'validationSchema/options';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getOptions();
    case 'POST':
      return createOption();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOptions() {
    const data = await prisma.option
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'option'));
    return res.status(200).json(data);
  }

  async function createOption() {
    await optionValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.answer?.length > 0) {
      const create_answer = body.answer;
      body.answer = {
        create: create_answer,
      };
    } else {
      delete body.answer;
    }
    const data = await prisma.option.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
