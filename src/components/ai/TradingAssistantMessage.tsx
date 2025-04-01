
import React from 'react';
import ReactMarkdown from 'react-markdown';
// Fix this component to correctly use ReactMarkdown props
const TradingAssistantMessage = ({ content }) => {
  return (
    <div className="p-4 rounded-lg bg-charcoalSecondary/40 border border-gray-700 text-white">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2 text-gray-200" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mt-3 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mt-3 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-md font-bold text-white mt-2 mb-1" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 text-gray-200" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 text-gray-200" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-cyan underline" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-700 pl-4 py-1 my-2 text-gray-300" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 p-4 rounded-md my-3 overflow-x-auto text-sm" {...props} />
          ),
          code: ({ node, inline, ...props }) => {
            // Handle inline code vs code blocks
            if (inline) {
              return <code className="bg-gray-800 px-1 py-0.5 rounded text-cyan" {...props} />;
            }
            return <code className="block p-2 bg-gray-900 text-gray-100" {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default TradingAssistantMessage;
