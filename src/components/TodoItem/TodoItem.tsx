import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loading: boolean;
  loadingId: number | number[];
  onDelete: (id: number) => void;
  onCompleted: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  loadingId,
  onDelete,
  onCompleted,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [inputValue, setInputValue] = useState(todo.title);
  const [update, setUpdate] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const { title, id, userId, completed } = todo;

  useEffect(() => {
    setUpdatedTitle(title);
    setUpdate(false);
  }, [title]);

  useEffect(() => {
    if (refInput.current) {
      refInput.current?.focus();
    }
  }, [updatedTitle]);

  const handleTodoCompleted = () => {
    const isCompleted = completed ? false : true;

    onCompleted({
      title,
      id,
      userId,
      completed: isCompleted,
    });
  };

  const handleBlur = (event: React.FormEvent) => {
    event.preventDefault();

    if (title === updatedTitle) {
      setUpdate(false);

      return;
    }

    if (updatedTitle === '') {
      onDelete(todo.id);
    } else {
      onCompleted({
        title: updatedTitle,
        id,
        userId,
        completed,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setUpdate(false);
      setInputValue(todo.title);
      setUpdatedTitle(todo.title);
    }
  };

  const handleUpdateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setUpdatedTitle(event.target.value.trim());
    setInputValue(event.target.value);
  };

  const isLoading = (currentLoadingId: number) => {
    return (
      loading &&
      (typeof loadingId === 'number'
        ? loadingId === currentLoadingId
        : loadingId.includes(currentLoadingId))
    );
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })} key={id}>
      <label className="todo__status-label" htmlFor={`todo-status-${id}`}>
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          value={inputValue}
          onChange={() => handleTodoCompleted()}
        />
        {/* accessible text for the label */}
      </label>

      {!update ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setUpdate(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleBlur}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={refInput}
            value={inputValue}
            onChange={handleUpdateTitle}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
