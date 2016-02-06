/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, Jupyter Development Team.
|
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
'use strict';

import {
  showDialog, generateClipboardEvent, copyToClipboard
} from '../../lib';


function main(): void {
  let button1 = document.createElement('button');
  button1.textContent = 'Copy to clipboard';
  button1.onclick = () => {
    generateClipboardEvent(button1);
  }
  let button2 = document.createElement('button');
  button2.textContent = 'Copy foo to clipboard';
  button2.onclick = () => {
    copyToClipboard('foo');
  }
  let button3 = document.createElement('button');
  button3.textContent = 'Custom cut event';
  button3.onclick = () => {
    generateClipboardEvent(button3, 'cut');
  }
  (button3 as any).oncut = (event: ClipboardEvent) => {
    let data = event.clipboardData || (window as any).clipboardData;
    data.setData('text', 'Custom text data');
    if (event.clipboardData) {
      data.setData('baz', 'foo');
    }
    event.preventDefault();
  }
  let div = document.createElement('div');
  div.appendChild(button1);
  div.appendChild(button2);
  div.appendChild(button3);
  document.body.appendChild(div);
  showDialog({ title: 'Example', body: 'Hello, world!' });
}


window.onload = main;
