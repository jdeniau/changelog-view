import React from 'react';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';

function Markdown({ children }) {
  return marked(children, {
    renderer: new TerminalRenderer(),
  });
}

export default Markdown;
