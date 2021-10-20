import React, { useState, useEffect } from 'react';

import IdeModel, { CursorPosition } from '../../../data/model/model';
import Message from '../../../data/model/message';
import EditorPresenter from './EditorTabContentPresenter';
import { getFileLanguage } from '../../../utils/file-extension';
import Empty from '../../components/empty/Empty';
import PromiseNoData from '../../components/promise-no-data/PromiseNoData';

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
  const [state, setState] = useState(0);
  const forceRerender = () => setState(state + 1);

  useEffect(() => {
    const focusedFileListener = (m: Message) => {
      if (m === Message.FOCUSED_FILE) {
        if (model.persisted) {
          setContent(model.contentToSave);
          model.setPersisted(false);
        } else setContent(null);

        setFocusedFile(model.getFocusedFile());
        setLanguage(model.language);
      }
    };
    model.addObserver(focusedFileListener);
    return () => model.removeObserver(focusedFileListener);
  }, []);

  if (!focusedFile)
    return <Empty message="No file opened" className="empty--project" />;

  if (content === null)
    return (
      <PromiseNoData
        promise={model.getFileContent(focusedFile.id)}
        onComplete={(c: string) => setContent(c)}
        loadingMessage="Fetching file content..."
        tryAgain={forceRerender}
        classNameBlck="ide__editor"
        errorMessage="Failed to fetch file content"
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
      model={model}
    />
  );
}
