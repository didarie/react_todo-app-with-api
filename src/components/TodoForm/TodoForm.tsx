import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

interface Props {
  onError: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  onTempTodo: (todo: Todo | null) => void;
}

export const TodoForm: React.FC<Props> = ({
  onError,
  onSubmit,
  onTempTodo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('');
  const [userId] = useState(USER_ID);
  const [completed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [isDisabled]);

  const reset = () => {
    setInputValue('');
    setTitle('');
    onTempTodo(null);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      onError('Title should not be empty');

      return;
    }

    setIsDisabled(true);
    onTempTodo({ title, userId, id: 0, completed });

    onSubmit({ title, userId, id: 0, completed })
      .then(reset)
      .catch(() => onError('Unable to add a todo'))
      .finally(() => setIsDisabled(false));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trim());
    setInputValue(event.target.value);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isDisabled}
        ref={refInput}
        value={inputValue}
        onChange={handleTitleChange}
        autoFocus
      />
    </form>
  );
};
