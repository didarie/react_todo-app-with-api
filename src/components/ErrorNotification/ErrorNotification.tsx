import classNames from 'classnames';
import React from 'react';

interface Props {
  error: string;
  onError: (error: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError('')}
      />
      {error}
    </div>
  );
};
