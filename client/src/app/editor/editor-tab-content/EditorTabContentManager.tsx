import React, { useState, useEffect } from 'react';

import IdeModel, { CursorPosition, FileData } from '../../../data/model/model';
import Message from '../../../data/model/message';
import EditorPresenter from './EditorTabContentPresenter';
import Loader from '../../components/loader/Loader';
import ProjectError from '../../components/error/ProjectError';
import { getFileLanguage } from '../../../utils/file-extension';

interface EditorTabContentManagerProps {
  model: IdeModel;
  onEditorCursorMoved: (position: CursorPosition) => void;
  onEditorSelection: (start: CursorPosition, end: CursorPosition) => void;
  onContentInsert: (index: number, text: string) => void;
  onContentReplace: (index: number, length: number, text: string) => void;
  onContentDelete: (index: number, length: number) => void;
  onScrollChange: (scrollLeft: number, scrollTop: number) => void;
}

export default function EditorTabContentManager({
  model,
  onEditorCursorMoved,
  onEditorSelection,
  onContentInsert,
  onContentReplace,
  onContentDelete,
  onScrollChange,
}: EditorTabContentManagerProps): JSX.Element {
  const [focusedFile, setFocusedFile] = useState(model.getFocusedFile());
  const [language, setLanguage] = useState(
    model.focusedFile ? getFileLanguage(model.focusedFile.name) : ''
  );
  const [content, setContent] = useState<string | null>(null);
  const [loadFileError, setLoadFileError] = useState(false);

  useEffect(() => {
    const focusedFileListener = (m: Message) => {
      if (m === Message.FOCUSED_FILE) {
        // if (focusedFile?.id !== model.focusedFile?.id) {
        setFocusedFile(model.getFocusedFile());
        setContent(null);
        setLoadFileError(false);
        // }

        const newLanguage = model.focusedFile
          ? getFileLanguage(model.focusedFile.name)
          : '';
        setLanguage(newLanguage);
      }
    };
    model.addObserver(focusedFileListener);
    return () => model.removeObserver(focusedFileListener);
  }, []);

  console.log('focusedFile: ', focusedFile);
  if (!focusedFile) return <div>open a file</div>;
  if (!loadFileError && content === null) {
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
      onScrollChange={onScrollChange}
      onContentInsert={onContentInsert}
      onContentReplace={onContentReplace}
      onContentDelete={onContentDelete}
      onEditorSelection={onEditorSelection}
      onEditorCursorMoved={onEditorCursorMoved}
      language={language}
      fileContent={content as string}
      isFocused
      model={model}
    />
  );
}
