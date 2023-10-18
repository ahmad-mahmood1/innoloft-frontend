import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";

export const sanitizeHtmlString = (str: string): string => {
  return DOMPurify.sanitize(str, {
    ALLOWED_ATTR: ["class", "src"],
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "img"],
  });
};

export const getRawHtmlString = (editorState: EditorState): string => {
  return draftToHtml(convertToRaw(editorState.getCurrentContent()));
};

export const editorContentFromHtmlString = (val: string): ContentState => {
  try {
    //TODO possible issue in retriving applied classes from the input html string
    const blocksFromHTML = convertFromHTML(val);

    const content = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return content;
  } catch (e) {
    return ContentState.createFromText("");
  }
};
