import Router from '@koa/router';
import { Prisma, PrismaClient } from '@prisma/client';
import Joi from 'joi';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import setupTracingMiddleware from './tracing';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const tracingMiddleware = setupTracingMiddleware();

const app = new Koa();

app.use(tracingMiddleware);

const router = new Router({
  prefix: '/showtimes',
});

app.use(bodyParser());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

interface CreateShowtimeParams {
  movieId: number;
  start: Date;
  end: Date;
}

const CreateShowtimeParamsSchema = Joi.object<CreateShowtimeParams>({
  movieId: Joi.number().required(),
  start: Joi.date().required(),
  end: Joi.date().required(),
});

router
  .get('/', async (ctx) => {
    let findManyOpts: Prisma.ShowtimeFindManyArgs | undefined = undefined;

    if ('movieId' in ctx.query && typeof ctx.query.movieId === 'string') {
      findManyOpts = {
        where: {
          movieId: parseInt(ctx.query.movieId, 10),
        },
      };
    }

    const allShowtimes = await prisma.showtime.findMany(findManyOpts);

    ctx.body = {
      status: 'success',
      data: allShowtimes,
    };
  })
  .get('/:showtime_id', async (ctx) => {
    const showtime = await prisma.showtime.findFirst({
      where: {
        id: parseInt(ctx.params.showtime_id, 10),
      },
    });

    if (showtime == null) {
      ctx.status = 404;
      ctx.body = {
        status: 'failure',
        message: 'Not Found',
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: showtime,
    };
  })
  .post('/', async (ctx) => {
    const validationResult = CreateShowtimeParamsSchema.validate(
      ctx.request.body
    );

    if (validationResult.error != null) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: validationResult.error.message,
      };
      return;
    }

    const count = await prisma.showtime.count({
      where: {
        OR: [
          {
            start: {
              lte: validationResult.value.start,
            },
            end: {
              gte: validationResult.value.start,
            },
          },
          {
            start: {
              gte: validationResult.value.end,
            },
            end: {
              lte: validationResult.value.end,
            },
          },
        ],
      },
    });

    if (count > 0) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Showtime conflict',
      };
      return;
    }

    const showtime = await prisma.showtime.create({
      data: {
        movieId: validationResult.value.movieId,
        start: validationResult.value.start,
        end: validationResult.value.end,
      },
    });

    ctx.body = {
      status: 'success',
      showtime,
    };
  })
  .delete('/:showtime_id', async (ctx) => {
    await prisma.showtime.delete({
      where: {
        id: parseInt(ctx.params.showtime_id, 10),
      },
    });

    ctx.status = 204;
    ctx.body = {
      status: 'success',
    };
  });

app.use(router.routes()).use(router.allowedMethods());

console.log('Starting Koa');
app.listen(5000);
