import React, { useEffect, useState } from 'react';

import IdeModel from '../../../data/model/model';
import Message from '../../../data/model/message';
import EditorTabToggleView from './EditorTabToggleView';
import { extractBasename } from '../../../utils/file-extension';

interface EditorTabsPresenterProps {
  model: IdeModel;
  stopFollowing: () => void;
}

export default function EditorTabToggleManager({
  model,
  stopFollowing,
}: EditorTabsPresenterProps): JSX.Element {
  const [openedFiles, setOpenedFiles] = useState(model.currentTabFiles);
  const [focusedFile, setFocusedFile] = useState(model.getFocusedFile());

  useEffect(() => {
    const currentFileListener = (m: Message) => {
      if (m === Message.CURRENT_TABS)
        setOpenedFiles([...model.currentTabFiles]);
      else if (m === Message.FOCUSED_FILE)
        setFocusedFile(model.getFocusedFile());
    };
    model.addObserver(currentFileListener);

    return () => model.removeObserver(currentFileListener);
  }, []);

  return (
    <div className="editorTab--togglesContainer">
      {openedFiles.map((file) => (
        <EditorTabToggleView
          name={extractBasename(file.name)}
          isFocused={file.id === focusedFile?.id}
          id={file.id}
          key={file.id}
          handleClick={({ id, name }) => {
            stopFollowing();
            model.setFocusedFile({ name, id });
          }}
        />
      ))}
    </div>
  );
}
