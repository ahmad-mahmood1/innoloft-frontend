import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

type RichTextEditorProps = Omit<
  EditorProps,
  "editorState" | "editorStateChange"
> & {
  editorState?: EditorState;
  editorStateChange?: (val: EditorState) => void;
};

const toolBarBaseConfig = {
  options: ["inline", "list", "textAlign", "link", "history"],
  inline: {
    options: ["bold", "italic"],
  },
};

function RichTextEditor({
  editorState,
  editorStateChange,
  ...rest
}: RichTextEditorProps) {
  const [internalEditorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const value = editorState ? editorState : internalEditorState;

  const handleChange = (editorState: EditorState) => {
    if (editorStateChange) {
      editorStateChange(editorState);
    } else {
      setEditorState(editorState);
    }
  };

  return (
    <Editor
      editorClassName="overflow-scroll"
      editorState={value}
      onEditorStateChange={handleChange}
      toolbarClassName="border-0"
      toolbar={toolBarBaseConfig}
      {...rest}
    />
  );
}

export default RichTextEditor;
