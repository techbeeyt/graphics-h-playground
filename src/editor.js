const editor = document.getElementById("editor");

// Inserts text at caret position and moves caret
function insertTextAtCaret(text, caretOffset) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  // Insert text
  const textNode = document.createTextNode(text);
  range.deleteContents();
  range.insertNode(textNode);

  // Move caret to the desired position
  range.setStart(textNode, caretOffset);
  range.collapse(true);

  // Restore selection
  selection.removeAllRanges();
  selection.addRange(range);
}

// Calculate indentation (leading spaces) of the current line
function getCurrentLineIndentation() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return "";

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();

  // Set range to start of content
  preCaretRange.selectNodeContents(editor);
  preCaretRange.setEnd(range.endContainer, range.endOffset);

  // Get the text before the caret
  const textBeforeCaret = preCaretRange.toString();
  const lines = textBeforeCaret.split("\n");

  // Return the indentation of the last line
  const lastLine = lines[lines.length - 1];
  return lastLine.match(/^\s*/)?.[0] || "";
}

// Syntax highlighting
function highlightEditorContent() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const caretOffset = saveCaretPosition(editor);

  const code = editor.innerText;
  editor.innerHTML = hljs.highlight(code, { language: "javascript" }).value;

  restoreCaretPosition(editor, caretOffset);
}

window.highlightEditorContent = highlightEditorContent;

function saveCaretPosition(context) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(context);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
}

function restoreCaretPosition(context, offset) {
  const selection = window.getSelection();
  const range = document.createRange();
  let currentOffset = 0;

  function traverse(node) {
    if (node.nodeType === 3) {
      // Text node
      if (currentOffset + node.length >= offset) {
        range.setStart(node, offset - currentOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
      }
      currentOffset += node.length;
    } else {
      for (let child of node.childNodes) {
        if (traverse(child)) return true;
      }
    }
    return false;
  }

  traverse(context);
}

// Handle keydown for auto-completion, Enter, and Tab
editor.addEventListener("keydown", (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  // Auto-completion for {
  if (e.key === "{") {
    e.preventDefault();
    insertTextAtCaret("{}", 1); // Cursor goes between the brackets
    highlightEditorContent();
  }

  // Auto-completion for [
  else if (e.key === "[") {
    e.preventDefault();
    insertTextAtCaret("[]", 1);
    highlightEditorContent();
  }

  // Auto-completion for (
  else if (e.key === "(") {
    e.preventDefault();
    insertTextAtCaret("()", 1);
    highlightEditorContent();
  }

  // Tab key: Insert 4 spaces
  else if (e.key === "Tab") {
    e.preventDefault();
    insertTextAtCaret("    ", 4);
    highlightEditorContent();
  }

  // Enter key: Add indentation
  else if (e.key === "Enter") {
    e.preventDefault();

    // Get the current line's indentation
    const indentation = getCurrentLineIndentation();

    // Insert a new line with the same indentation as the current line
    insertTextAtCaret("\n" + indentation);
    highlightEditorContent();

    // Move caret to the new line
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const node = range.startContainer;

    // Move caret to the end of the inserted line
    if (node.nodeType === Node.TEXT_NODE) {
      range.setStart(node, range.startOffset + indentation.length + 1);
      range.setEnd(node, range.startOffset + indentation.length + 1);
    } else {
      const textNode = document.createTextNode("");
      range.insertNode(textNode);
      range.setStart(textNode, 0);
      range.setEnd(textNode, 0);
    }
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

// Highlight syntax on input
editor.addEventListener("input", () => {
  highlightEditorContent();
});
