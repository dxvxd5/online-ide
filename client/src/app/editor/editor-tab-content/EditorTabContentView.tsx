import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

import '../../../assets/styles/editor.css';

interface EditorViewProps {
  language: string;
  code: string;
  handleMount: OnMount;
  onContentChange: (content: string | undefined) => void;
}

export default function EditorView({
  language,
  code,
  handleMount,
  onContentChange,
}: EditorViewProps): JSX.Element {
  return (
    <div className="ide__tab-content">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={(content) => onContentChange(content)}
        onMount={handleMount}
        theme="vs-dark"
      />
    </div>
  );
}
