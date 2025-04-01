
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TradingAssistantMessageProps {
  content: string;
  role?: 'user' | 'assistant' | 'system';
  timestamp?: Date;
}

const TradingAssistantMessage: React.FC<TradingAssistantMessageProps> = ({ 
  content, 
  role = 'assistant',
  timestamp
}) => {
  return (
    <div className={`p-4 rounded-lg ${
      role === 'user' 
        ? 'bg-gray-800 border border-gray-700' 
        : role === 'system' 
          ? 'bg-gray-900/60 border-l-4 border-cyan' 
          : 'bg-charcoalSecondary/40 border border-gray-700'
      } text-white mb-4`}>
      {timestamp && (
        <div className="text-xs text-gray-400 mb-1">
          {timestamp.toLocaleTimeString()}
        </div>
      )}
      <ReactMarkdown
        components={{
          p: ({children, ...props}) => (
            <p className="mb-2 text-gray-200" {...props}>
              {children}
            </p>
          ),
          h1: ({children, ...props}) => (
            <h1 className="text-xl font-bold text-white mt-3 mb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({children, ...props}) => (
            <h2 className="text-lg font-bold text-white mt-3 mb-2" {...props}>
              {children}
            </h2>
          ),
          h3: ({children, ...props}) => (
            <h3 className="text-md font-bold text-white mt-2 mb-1" {...props}>
              {children}
            </h3>
          ),
          ul: ({children, ...props}) => (
            <ul className="list-disc pl-5 mb-3 text-gray-200" {...props}>
              {children}
            </ul>
          ),
          ol: ({children, ...props}) => (
            <ol className="list-decimal pl-5 mb-3 text-gray-200" {...props}>
              {children}
            </ol>
          ),
          li: ({children, ...props}) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          ),
          a: ({children, ...props}) => (
            <a className="text-cyan underline" {...props}>
              {children}
            </a>
          ),
          blockquote: ({children, ...props}) => (
            <blockquote className="border-l-4 border-gray-700 pl-4 py-1 my-2 text-gray-300" {...props}>
              {children}
            </blockquote>
          ),
          pre: ({children, ...props}) => (
            <pre className="bg-gray-900 p-4 rounded-md my-3 overflow-x-auto text-sm" {...props}>
              {children}
            </pre>
          ),
          code: ({className, children, inline}) => {
            // Handle inline code vs code blocks
            if (inline) {
              return (
                <code className="bg-gray-800 px-1 py-0.5 rounded text-cyan">
                  {children}
                </code>
              );
            }

            const match = /language-(\w+)/.exec(className || '');
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match ? match[1] : 'javascript'}
                PreTag="div"
                wrapLines={true}
                wrapLongLines={true}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default TradingAssistantMessage;
