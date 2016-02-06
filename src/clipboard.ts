// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

/**
 * Options for generating Clipboard events.
 */
export
interface IClipboardEventOptions {
  /**
   * The type of event: 'copy' (default) or 'cut'.
   */
  type?: string;

  /**
   * The optional text to put on the clipboard.
   */
  text?: string;
}


/**
 * Generate a clipboard event on a node.
 *
 * #### Notes
 * This can only be called in response to a user input event.
 * Paste events cannot be generated.
 * If `text` is given, that text will be added to the clipboard.
 * Otherwise, the text will be the node contents unless the node
 * specifies a `copy` event listener.
 */
export
function generateClipboardEvent(node: HTMLElement, options?: IClipboardEventOptions): void {
  // http://stackoverflow.com/a/5210367
  options = options || {};
  let type = options.type || 'copy';

  // Identify selected text.
  var sel = window.getSelection();

  // Save the current selection.
  var savedRanges: any[] = [];
  for (var i = 0, len = sel.rangeCount; i < len; ++i) {
    savedRanges[i] = sel.getRangeAt(i).cloneRange();
  }

  // Select the node content.
  var range = document.createRange();
  range.selectNodeContents(node);
  sel.removeAllRanges();
  sel.addRange(range);

  // If given, add the desired text to the clipboard during the event.
  if (options.text) {
    let handler = (event: ClipboardEvent) => {
      let data = event.clipboardData || (window as any).clipboardData;
      data.setData('text', options.text);
      event.preventDefault();
      node.removeEventListener(type, handler);
    };
    node.addEventListener(type, handler);
  }

  // Execute the command.
  document.execCommand(type);

  // Restore the previous selection.
  sel = window.getSelection();
  sel.removeAllRanges();
  for (var i = 0, len = savedRanges.length; i < len; ++i) {
    sel.addRange(savedRanges[i]);
  }
}
