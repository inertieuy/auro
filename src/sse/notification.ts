import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { prisma } from '../client/prisma';

export class SSENotification {
  static async streamNotification(c: Context) {
    return streamSSE(c, async (stream) => {
      const payload = c.get('jwtPayload');
      console.log(payload);
      const latestNotif = await prisma.notification.findFirst({
        where: {
          accountId: payload.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          body: true,
        },
      });
      if (latestNotif) {
        await stream.writeSSE({
          data: JSON.stringify(latestNotif),
          event: 'notifications',
        });
      }
      await prisma.notification.update({
        where: {
          id: latestNotif.id,
        },
        data: {
          isRead: 1,
        },
      });
    });
  }
}
