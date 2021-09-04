import React, { ReactElement, ReactNode } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';

SyntaxHighlighter.registerLanguage('jsx', jsx);

interface Props {
  children: ReactNode;
  language?: string;
}

function CommonHighlighter({
  children,
  language = 'jsx',
}: Props): ReactElement {
  return (
    <SyntaxHighlighter
      language={language}
      style={prism}
      customStyle={{ padding: 20 }}
    >
      {children}
    </SyntaxHighlighter>
  );
}

export default CommonHighlighter;
