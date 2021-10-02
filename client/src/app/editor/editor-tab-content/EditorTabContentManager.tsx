import React, { useState, useEffect } from 'react';

import IdeModel, { CursorPosition } from '../../../data/model/model';
import Message from '../../../data/model/message';
import EditorPresenter from './EditorTabContentPresenter';
import Loader from '../../components/loader/Loader';
import ProjectError from '../../components/error/ProjectError';

interface EditorTabContentManagerProps {
  model: IdeModel;
  onEditorCursorMoved: (position: CursorPosition) => void;
  onEditorSelection: (start: CursorPosition, end: CursorPosition) => void;
  onContentInsert: (index: number, text: string) => void;
  onContentReplace: (index: number, length: number, text: string) => void;
  onContentDelete: (index: number, length: number) => void;
}

export default function EditorTabContentManager({
  model,
  onEditorCursorMoved,
  onEditorSelection,
  onContentInsert,
  onContentReplace,
  onContentDelete,
}: EditorTabContentManagerProps): JSX.Element {
  // eslint-disable-next-line react/destructuring-assignment
  const [focusedFile, setFocusedFile] = useState(model.getFocusedFile());
  const [content, setContent] = useState<string | null>(null);
  const [loadFileError, setLoadFileError] = useState(false);

  useEffect(() => {
    const focusedFileListener = (m: Message) => {
      if (m === Message.FOCUSED_FILE) {
        setFocusedFile(model.getFocusedFile());
        setContent(null);
        setLoadFileError(false);
      }
    };
    model.addObserver(focusedFileListener);
    return () => model.removeObserver(focusedFileListener);
  }, []);

  if (!loadFileError && content === null) {
    if (!focusedFile) return <div>open a file</div>;

    model
      .getFileContent(focusedFile.id)
      .then((c) => setContent(c))
      .catch(() => setLoadFileError(true));

    return <Loader />;
  }

  if (loadFileError)
    return (
      <ProjectError
        projectErrorInfo="Could not load file. Please try again"
        tryAgain={() => setLoadFileError(false)}
      />
    );

  return (
    <EditorPresenter
      onContentInsert={onContentInsert}
      onContentReplace={onContentReplace}
      onContentDelete={onContentDelete}
      onEditorSelection={onEditorSelection}
      onEditorCursorMoved={onEditorCursorMoved}
      fileName={focusedFile.name}
      fileContent={content as string}
      isFocused
      model={model}
    />
  );
}
