import {
  assign,
  pick
} from 'lodash';

import Model from '../../models';
import {
  getLogger,
  getErrorHandler
} from '../../utils';

const Todo = Model('Todo');

const logger = getLogger(__filename);
const handleError = getErrorHandler(logger);

export async function get(ctx) {
  try {
    const filters = {
      all: undefined,
      active: {
        completed: false
      },
      completed: {
        completed: true
      }
    };
    ctx.body = (
      await Todo
        .find(filters[ctx.query.filter])
        .sort({ create_date: 1 })
    )
      .map(todo => todo._basic);
  } catch (e) {
    handleError('Get todos error', e, ctx);
  }
}

export async function create(ctx) {
  try {
    await new Todo(ctx.request.body).save();
    ctx.status = 204;
  } catch (e) {
    handleError('Create todo error', e, ctx);
  }
}

export async function update(ctx) {
  try {
    const todo = await Todo.findById(ctx.params.id);
    if (!todo) {
      handleError('Todo not exists', ctx, 404);
    }
    assign(todo, pick(ctx.request.body, [
      'content',
      'completed'
    ]));
    await todo.save();
    ctx.status = 204;
  } catch (e) {
    handleError('Update todo error', e, ctx);
  }
}

export async function remove(ctx) {
  try {
    await Todo.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  } catch (e) {
    handleError('Remove todo error', e, ctx);
  }
}
