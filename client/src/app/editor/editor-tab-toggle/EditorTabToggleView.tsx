import React from 'react';
import './editor-tab-toggle.css';

interface TabToggleProps {
  name: string;
  isFocused: boolean;
  id: string;
  handleClick: ({ name, id }: Record<string, string>) => void;
}

export default function EditorTabToggleView({
  name,
  isFocused,
  handleClick,
  id,
}: TabToggleProps): JSX.Element {
  const focusClass = isFocused ? 'editorTab--toggle__focus' : '';
  return (
    <button
      type="button"
      className={`editorTab--toggle ${focusClass}`}
      onClick={() => handleClick({ id, name })}
    >
      {name}
    </button>
  );
}
