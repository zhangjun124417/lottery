import { pick } from 'lodash';

const Todo = (Schema) => {
  /**
   * Todo
   */
  const TodoSchema = new Schema({
    // 内容
    content: { type: String, required: true },

    // 完成状态
    completed: { type: Boolean, default: false },

    // 创建时间
    create_date: { type: Number, default: Date.now }
  });

  /**
   * Hooks
   */

  /**
   * Virtuals
   */
  TodoSchema
    .virtual('_basic')
    .get(function() {
      return pick(this, [
        'id',
        'content',
        'completed',
        'create_date'
      ]);
    });

  /**
   * Methods
   */

  /**
   * Statics
   */

  return TodoSchema;
};

export default Todo;
