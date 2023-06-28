import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { optionValidationSchema } from 'validationSchema/options';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.option
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getOptionById();
    case 'PUT':
      return updateOptionById();
    case 'DELETE':
      return deleteOptionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOptionById() {
    const data = await prisma.option.findFirst(convertQueryToPrismaUtil(req.query, 'option'));
    return res.status(200).json(data);
  }

  async function updateOptionById() {
    await optionValidationSchema.validate(req.body);
    const data = await prisma.option.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteOptionById() {
    const data = await prisma.option.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
