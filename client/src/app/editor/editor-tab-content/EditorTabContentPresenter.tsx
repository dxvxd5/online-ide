import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { OnMount } from '@monaco-editor/react';
import {
  RemoteCursorManager,
  RemoteSelectionManager,
  EditorContentManager,
} from '@convergencelabs/monaco-collab-ext';
import { editor } from 'monaco-editor';

import Message from '../../../data/model/message';
import IdeModel, {
  CursorPosition,
  Collaborator,
  CollaboratorCursor,
  CollaboratorSelection,
  EditorContentOperation,
  EditorContentOperationType,
  Insertion,
  Deletion,
  Replacement,
} from '../../../data/model/model';
import { randomNumberInRange } from '../../../utils/random';
import EditorView from './EditorTabContentView';
import toastPromise from '../../../utils/toast';

interface EditorPresenterProps {
  model: IdeModel;
  language: string;
  fileContent: string;
  onEditorCursorMoved: (position: CursorPosition) => void;
  onEditorSelection: (start: CursorPosition, end: CursorPosition) => void;
  onContentInsert: (index: number, text: string) => void;
  onContentReplace: (index: number, length: number, text: string) => void;
  onContentDelete: (index: number, length: number) => void;
  onScrollChange: (scrollLeft: number, scrollTop: number) => void;
}

export default function EditorPresenter({
  model,
  language,
  fileContent,
  onEditorCursorMoved,
  onEditorSelection,
  onContentInsert,
  onContentReplace,
  onContentDelete,
  onScrollChange,
}: EditorPresenterProps): JSX.Element {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const contentManagerRef = useRef<EditorContentManager>();
  const selectionManagerRef = useRef<RemoteSelectionManager>();
  const cursorManagerRef = useRef<RemoteCursorManager>();

  const fiveMinutes = 300000;
  const saveIntervalRef = useRef<number>();
  // const saveIntervalRef = useRef<NodeJS.Timeout>();

  function removeCollaborator(cursorID: string) {
    try {
      cursorManagerRef.current?.removeCursor(cursorID);
      selectionManagerRef.current?.removeSelection(cursorID);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  function saveCurrentFile(errorMsg = '', successMsg = '') {
    if (!model.focusedFile) {
      if (errorMsg) toast.error(errorMsg);
      return;
    }
    const msgs = {
      loading: 'Saving file...',
      success: successMsg || 'File saved',
      error: 'Could not save file',
    };
    const promise = model.saveContentIntoFile();
    toastPromise(promise, msgs);
  }

  function addCollaborator(joiner: Collaborator) {
    if (!joiner.focusedFile || joiner.focusedFile.id !== model.focusedFile.id)
      return;

    const joinerParams = [joiner.id, joiner.color, joiner.name] as const;

    const c = cursorManagerRef?.current?.addCursor(...joinerParams);
    c?.setOffset(randomNumberInRange());

    selectionManagerRef?.current?.addSelection(...joinerParams);
  }

  function moveCursor(collabCursor: CollaboratorCursor): void {
    const offset = editorRef.current
      ?.getModel()
      ?.getOffsetAt(collabCursor.position);
    if (offset)
      cursorManagerRef.current?.setCursorOffset(collabCursor.id, offset);
  }

  function addSelection(collabSelection: CollaboratorSelection): void {
    const startOffset = editorRef.current
      ?.getModel()
      ?.getOffsetAt(collabSelection.selection.start);
    const endOffset = editorRef.current
      ?.getModel()
      ?.getOffsetAt(collabSelection.selection.end);
    if (startOffset && endOffset)
      selectionManagerRef.current?.setSelectionOffsets(
        collabSelection.id,
        startOffset,
        endOffset
      );
  }

  function applyContentOperation(o: EditorContentOperation) {
    switch (o.type) {
      case EditorContentOperationType.INSERTION:
        contentManagerRef.current?.insert(o.index, (o as Insertion).text);
        break;

      case EditorContentOperationType.DELETION:
        contentManagerRef.current?.delete(o.index, (o as Deletion).length);
        break;

      case EditorContentOperationType.REPLACEMENT:
        contentManagerRef.current?.replace(
          o.index,
          (o as Replacement).length,
          (o as Replacement).text
        );
        break;

      default:
        break;
    }
  }

  function removeAllCollaborators(collaborators: Collaborator[]) {
    collaborators.forEach((c) => removeCollaborator(c.id));
  }

  function addAllCollaborators(collaborators: Collaborator[]) {
    collaborators.forEach((c) => {
      addCollaborator(c);
    });
  }

  useEffect(() => {
    function collabListener(m: Message) {
      if (m === Message.USER_JOIN) {
        addCollaborator(model.joiner);
      } else if (m === Message.USER_LEFT) {
        removeCollaborator(model.leaver.id);
      } else if (m === Message.HOST_LEFT) {
        removeAllCollaborators(model.formerCollaborators);
      } else if (m === Message.CURSOR_MOVED) {
        moveCursor(model.collabCursor);
      } else if (m === Message.EDITOR_SELECTION) {
        addSelection(model.collabSelection);
      } else if (m === Message.CONTENT) {
        applyContentOperation(model.collabContentOperation);
      } else if (m === Message.EDITOR_SCROLL) {
        editorRef.current?.setScrollPosition(model.scrollPosition);
      } else if (m === Message.COLLAB_FOCUSED_FILE_CHANGE) {
        removeAllCollaborators(model.collaborators);
        addAllCollaborators(model.collaborators);
      }
    }
    model.addObserver(collabListener);

    saveIntervalRef.current = setInterval(() => {
      saveCurrentFile('', 'File automatically saved');
    }, fiveMinutes);

    return () => {
      contentManagerRef.current?.dispose();
      model.removeObserver(collabListener);
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  const handleMount: OnMount = (e, monaco) => {
    editorRef.current = e;

    cursorManagerRef.current = new RemoteCursorManager({
      editor: e,
      tooltips: true,
      tooltipDuration: 2,
    });

    selectionManagerRef.current = new RemoteSelectionManager({
      editor: e,
    });

    editorRef.current.onDidScrollChange((event) => {
      onScrollChange(event.scrollLeft, event.scrollTop);
    });

    contentManagerRef.current = new EditorContentManager({
      editor: e,
      onInsert(index: number, text: string) {
        onContentInsert(index, text);
      },
      onReplace(index: number, length: number, text: string) {
        onContentReplace(index, length, text);
      },
      onDelete(index, length) {
        onContentDelete(index, length);
      },
    });

    editorRef.current.onDidChangeCursorPosition((event) =>
      onEditorCursorMoved(event.position)
    );

    editorRef.current.onDidChangeCursorSelection((event) =>
      onEditorSelection(
        event.selection.getStartPosition(),
        event.selection.getEndPosition()
      )
    );

    const editorModel = e.getModel();
    if (editorModel)
      model.setFileContentToSave(editorModel.getValue() as string);

    // Monaco doesn't support non-bitwise sign
    editorRef.current.addCommand(
      // eslint-disable-next-line no-bitwise
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
      function () {
        saveCurrentFile('No file opened');
      }
    );

    addAllCollaborators(model.collaborators);

    console.log('Mounted');
  };

  const onChange = (content: string | undefined): void => {
    if (content !== undefined) {
      model.setFileContentToSave(content);
      if (model.roomID) model.saveContentIntoFile().catch();
    }
  };

  return (
    <EditorView
      language={language}
      code={fileContent}
      handleMount={handleMount}
      onContentChange={onChange}
    />
  );
}
