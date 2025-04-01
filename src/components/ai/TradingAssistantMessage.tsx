
import React from 'react';
import { Bot, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface TradingAssistantMessageProps {
  message: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

const TradingAssistantMessage: React.FC<TradingAssistantMessageProps> = ({
  message,
  role,
  timestamp
}) => {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : ''}`}>
      <div 
        className={`
          max-w-[85%] rounded-xl p-4
          ${isUser 
            ? 'bg-cyan text-gray-900 rounded-tr-none' 
            : isSystem 
              ? 'bg-gray-800/50 text-gray-300' 
              : 'bg-gray-800 text-gray-100 rounded-tl-none'
          }
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4 text-cyan" />
          )}
          <span className="font-medium text-sm">
            {isUser ? 'You' : isSystem ? 'System' : 'AI Assistant'}
          </span>
          <span className="text-xs text-opacity-70 ml-auto">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>
        
        <div className={`prose max-w-none ${!isUser ? 'prose-invert' : ''}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message}</p>
          ) : (
            <ReactMarkdown 
              className="whitespace-pre-wrap text-sm"
              components={{
                // Override to avoid hydration mismatch
                p: ({node, ...props}) => <p className="my-2" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-5 mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold mt-4 mb-1" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-gray-700/50 px-1 py-0.5 rounded" {...props} />
                    : <code className="block bg-gray-700/50 p-2 rounded my-2 overflow-x-auto" {...props} />
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingAssistantMessage;
