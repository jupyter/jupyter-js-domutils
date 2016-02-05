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

  /**
   * The target element (defaults to `document`).
   */
  node?: HTMLElement;
}


/**
 * Generate a custom clipboard event.
 *
 * #### Notes
 * This can only be called in response to a user input event.
 * Paste events cannot be generated.
 * Either a node or text (or both) must be specified.
 */
export
function generateClipboardEvent(options: IClipboardEventOptions): void {
  // http://stackoverflow.com/a/5210367
  let type = options.type || 'copy';
  if (!options.node && !options.text) {
    throw Error('Must specify either a node or text to put on clipboard');
  }
  let node = options.node || document.body;

  // Identify selected text.
  var sel = window.getSelection();

  // Save the current selection.
  var savedRanges: any[] = [];
  for (var i = 0, len = sel.rangeCount; i < len; ++i) {
    savedRanges[i] = sel.getRangeAt(i).cloneRange();
  }

  // Select the node's content.
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
