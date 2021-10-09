import React from 'react';

import Editor, { OnMount } from '@monaco-editor/react';
import './editorTabContent.css';

interface EditorViewProps {
  language: string;
  code: string;
  handleMount: OnMount;
  onContentChange: (content: string | undefined) => void;
  isFocused: boolean;
}

export default function EditorView({
  language,
  code,
  handleMount,
  isFocused,
  onContentChange,
}: EditorViewProps): JSX.Element {
  const focusClass = isFocused ? 'editorTab--content__focus' : '';

  return (
    <div className={`editorTab--content ${focusClass}`}>
      <Editor
        height="100vh"
        defaultLanguage={language}
        value={code}
        onChange={(content) => onContentChange(content)}
        onMount={handleMount}
        theme="vs-dark"
      />
    </div>
  );
}
