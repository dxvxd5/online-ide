/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

interface TabToggleProps {
  name: string;
  isFocused: boolean;
  id: string;
  handleClick: ({ name, id }: Record<string, string>) => void;
  closeFileFromTab: ({ name, id }: Record<string, string>) => void;
}

export default function EditorTabToggleView({
  name,
  isFocused,
  handleClick,
  closeFileFromTab,
  id,
}: TabToggleProps): JSX.Element {
  const be = 'ide__editor-tab-toggle';
  const className = `${be} ${isFocused ? `${be}--focus` : ''}`;
  return (
    <div className={className}>
      <div
        className={`${be}-name`}
        role="button"
        tabIndex={0}
        onClick={() => handleClick({ id, name })}
      >
        <span>{name}</span>
      </div>
      <div
        className={`${be}-cross`}
        role="button"
        tabIndex={0}
        onClick={() => closeFileFromTab({ id, name })}
      >
        X
      </div>
    </div>
  );
}
