import { each } from 'lodash';

import Schedule from './schedule';
import Todo from './todo';
import User from './user';
import Statics from './statistic';

const schemas = {
  Statics,
  Schedule,
  Todo,
  User
};
const models = {};

export default function(modelName) {
  return models && models[modelName];
}

export function setModels(mongooseClient, redisClient) {
  each(schemas, (schema, name) => {
    models[name] = mongooseClient.model(
      name,
      schema(mongooseClient.Schema, redisClient)
    );
  });
}
