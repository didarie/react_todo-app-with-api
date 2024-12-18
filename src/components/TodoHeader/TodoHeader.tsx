import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

interface Props {
  todos: Todo[];
  onError: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  onTempTodo: (todo: Todo | null) => void;
  onCompleted: (todos: Todo[]) => void;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  onError,
  onSubmit,
  onTempTodo,
  onCompleted,
}) => {
  const handleAllCompleted = (classes: string) => {
    const isActive = classes.includes('active');

    const updatedTodos = todos
      .filter(todo => (isActive ? todo.completed : !todo.completed))
      .map(todo => {
        const { title, id, userId } = todo;

        return {
          title,
          id,
          userId,
          completed: !isActive,
        };
      });

    if (updatedTodos.length > 0) {
      return onCompleted(updatedTodos);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() =>
            handleAllCompleted(
              classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              }),
            )
          }
        />
      )}

      {/* Add a todo on form submit */}
      <TodoForm onError={onError} onSubmit={onSubmit} onTempTodo={onTempTodo} />
    </header>
  );
};
