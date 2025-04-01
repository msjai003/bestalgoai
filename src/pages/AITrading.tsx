
import React, { useState, useRef, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, RefreshCw, Info, MessagesSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { askTradingAssistant } from '@/lib/services/aiService';
import TradingAssistantMessage from '@/components/ai/TradingAssistantMessage';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define message types
type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

const AITrading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome! I\'m your Algo Trading Assistant. Ask me anything about trading strategies, backtesting, technical analysis, or risk management.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample suggested questions
  const suggestedQuestions = [
    "What is algorithmic trading?",
    "How do I backtest a trading strategy?",
    "Explain Monte Carlo simulations for trading",
    "What's the difference between backtesting and forward testing?",
    "How can I optimize my trading strategy?"
  ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askTradingAssistant(input.trim());
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Could not get a response from the trading assistant.",
        variant: "destructive"
      });
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-2">
              <Bot className="text-cyan h-5 w-5" />
              <h1 className="text-lg font-semibold">Trading AI Assistant</h1>
            </div>
            <Badge variant="outline" className="text-xs bg-gray-800">
              <Info className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </header>

        <main className="pt-20 px-4 pb-24 max-w-4xl mx-auto">
          <div className="flex flex-col h-[calc(100vh-180px)]">
            {/* Message history */}
            <div className="flex-1 overflow-y-auto pr-2 mb-4">
              {messages.map((message, index) => (
                <TradingAssistantMessage 
                  key={index}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex justify-center my-4">
                  <RefreshCw className="h-6 w-6 text-cyan animate-spin" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggested questions - shown only when no conversation has started */}
            {messages.length < 2 && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2 flex items-center">
                  <MessagesSquare className="h-4 w-4 mr-1" />
                  Suggested questions to get started:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      className="text-xs text-gray-300 bg-gray-800/50 hover:bg-gray-700/50"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input area */}
            <Card className="mt-auto border-gray-800 bg-gray-800/30">
              <CardContent className="p-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask anything about algorithmic trading..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 min-h-[60px] resize-none bg-gray-900 border-gray-700"
                    maxLength={1000}
                    disabled={isLoading}
                  />
                  <Button 
                    className="h-12 w-12 rounded-md p-2 bg-cyan hover:bg-cyan/90 text-gray-900"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default AITrading;
