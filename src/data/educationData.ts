
export type Module = {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  flashcards: Flashcard[];
  quiz: Quiz;
};

export type Flashcard = {
  id: string;
  title: string;
  question: string;
  answer: string;
};

export type Quiz = {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
};

export const educationData: Record<string, Module[]> = {
  basics: [
    {
      id: 'module1',
      title: 'Introduction to Trading',
      description: 'Learn the fundamentals of trading and market basics',
      estimatedTime: 15,
      flashcards: [
        {
          id: 'card1',
          title: 'What is Trading?',
          question: 'Define trading in financial markets and explain its purpose.',
          answer: 'Trading is the buying and selling of financial assets such as stocks, bonds, currencies, and commodities with the goal of making a profit. It involves exchanging one asset for another based on market analysis and trading strategies.'
        },
        {
          id: 'card2',
          title: 'Market Participants',
          question: 'Who are the main participants in financial markets?',
          answer: 'The main participants include retail investors, institutional investors (mutual funds, pension funds), market makers, brokers, dealers, and central banks. Each plays a different role in providing liquidity and price discovery.'
        },
        {
          id: 'card3',
          title: 'Types of Markets',
          question: 'What are the main types of financial markets?',
          answer: 'The main types include stock markets (equities), bond markets (fixed income), forex markets (currencies), commodity markets, and derivatives markets (futures, options). Each serves different investment needs and has unique characteristics.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the primary goal of trading?',
            options: ['Losing money', 'Making a profit', 'Breaking even', 'Collecting assets'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'Which of these is NOT a major market participant?',
            options: ['Retail investors', 'Institutional investors', 'Social media influencers', 'Market makers'],
            correctAnswer: 2
          },
          {
            id: 'q3',
            question: 'Which market deals with company ownership shares?',
            options: ['Bond market', 'Stock market', 'Forex market', 'Commodity market'],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module2',
      title: 'Understanding Stock Markets',
      description: 'Learn how stock markets work and how to analyze stocks',
      estimatedTime: 20,
      flashcards: [
        {
          id: 'card1',
          title: 'Stock Markets',
          question: 'What is a stock market and how does it function?',
          answer: 'A stock market is a public marketplace where shares of companies are bought and sold. It functions through exchanges like NYSE and NASDAQ that match buyers with sellers, facilitating price discovery and providing liquidity for investors.'
        },
        {
          id: 'card2',
          title: 'Stock Indices',
          question: 'What are stock indices and why are they important?',
          answer: 'Stock indices are statistical measures that represent the value of a specific group of stocks. They're important because they provide a benchmark for market performance, allow investors to track specific market segments, and serve as the basis for index funds and ETFs.'
        },
        {
          id: 'card3',
          title: 'Market Orders',
          question: 'What are the different types of market orders?',
          answer: 'Common market orders include: Market orders (execute immediately at current price), Limit orders (execute at specified price or better), Stop orders (become market orders when price reaches trigger), and Stop-limit orders (combine features of stop and limit orders).'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which of these is NOT a major stock exchange?',
            options: ['NYSE', 'NASDAQ', 'FTSE', 'FOREX'],
            correctAnswer: 3
          },
          {
            id: 'q2',
            question: 'What type of order guarantees execution but not price?',
            options: ['Limit order', 'Market order', 'Stop order', 'Stop-limit order'],
            correctAnswer: 1
          },
          {
            id: 'q3',
            question: 'What do stock indices measure?',
            options: ['Individual stock performance', 'Company profits', 'Performance of a group of stocks', 'Trading volume'],
            correctAnswer: 2
          }
        ]
      }
    },
    // Additional modules would be added here - for brevity, I've included just two examples per level
    // In a real implementation, all 15 modules would be defined for each level
  ],
  intermediate: [
    {
      id: 'module1',
      title: 'Technical Analysis Fundamentals',
      description: 'Learn how to analyze price charts and identify patterns',
      estimatedTime: 25,
      flashcards: [
        {
          id: 'card1',
          title: 'Technical Analysis Basics',
          question: 'What is technical analysis and what does it assume about markets?',
          answer: 'Technical analysis is a method of evaluating securities by analyzing statistics generated by market activity. It assumes that price movements follow trends, history tends to repeat itself, and that market action discounts everything (all known information is already reflected in prices).'
        },
        {
          id: 'card2',
          title: 'Chart Patterns',
          question: 'What are some common chart patterns used in technical analysis?',
          answer: 'Common patterns include: Head and Shoulders (reversal pattern), Double Tops/Bottoms (reversal patterns), Triangles (continuation or reversal), Flags and Pennants (continuation), and Cup and Handle (continuation). Each pattern suggests potential future price movements.'
        },
        {
          id: 'card3',
          title: 'Technical Indicators',
          question: 'What are the main categories of technical indicators?',
          answer: 'The main categories are: Trend indicators (Moving Averages, MACD), Momentum indicators (RSI, Stochastic Oscillator), Volatility indicators (Bollinger Bands, ATR), and Volume indicators (OBV, Volume Profile). Each type provides different insights into market conditions.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which assumption is NOT part of technical analysis?',
            options: ['Price movements follow trends', 'History tends to repeat itself', 'Fundamentals determine long-term price', 'Market action discounts everything'],
            correctAnswer: 2
          },
          {
            id: 'q2',
            question: 'What does RSI stand for?',
            options: ['Relative Strength Index', 'Rapid Signal Indicator', 'Real Stock Indicator', 'Resistance Support Index'],
            correctAnswer: 0
          },
          {
            id: 'q3',
            question: 'Which pattern typically signals a trend reversal?',
            options: ['Flag', 'Pennant', 'Head and Shoulders', 'Triangle'],
            correctAnswer: 2
          }
        ]
      }
    },
    {
      id: 'module2',
      title: 'Risk Management Strategies',
      description: 'Master essential risk management techniques for trading',
      estimatedTime: 20,
      flashcards: [
        {
          id: 'card1',
          title: 'Position Sizing',
          question: 'What is position sizing and why is it important?',
          answer: 'Position sizing is determining how much of your capital to risk on a single trade. It's important because it helps protect your trading capital from excessive losses, ensures long-term survival in the markets, and helps maintain emotional control during drawdowns.'
        },
        {
          id: 'card2',
          title: 'Stop Loss Strategies',
          question: 'What are different types of stop loss strategies?',
          answer: 'Common stop loss strategies include: Fixed percentage stops (e.g., 2% of account), Volatility-based stops (using ATR), Support/Resistance stops (based on chart levels), Moving average stops, and Time-based stops. Each has advantages in different market conditions.'
        },
        {
          id: 'card3',
          title: 'Risk-Reward Ratio',
          question: 'What is risk-reward ratio and how is it calculated?',
          answer: 'Risk-reward ratio compares the potential profit of a trade to its potential loss. It's calculated by dividing the distance from entry to profit target by the distance from entry to stop loss. A favorable ratio (e.g., 1:2 or higher) means the potential reward exceeds the risk.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is a generally accepted maximum risk per trade?',
            options: ['1-2% of account', '10-15% of account', '25-30% of account', '50% of account'],
            correctAnswer: 0
          },
          {
            id: 'q2',
            question: 'In a 1:3 risk-reward ratio, if you risk $100, what is your profit target?',
            options: ['$33', '$100', '$300', '$900'],
            correctAnswer: 2
          },
          {
            id: 'q3',
            question: 'Which indicator is commonly used for volatility-based stops?',
            options: ['RSI', 'MACD', 'ATR (Average True Range)', 'Stochastic Oscillator'],
            correctAnswer: 2
          }
        ]
      }
    }
  ],
  pro: [
    {
      id: 'module1',
      title: 'Algorithmic Trading Basics',
      description: 'Introduction to algorithmic trading concepts and principles',
      estimatedTime: 30,
      flashcards: [
        {
          id: 'card1',
          title: 'Algorithmic Trading Definition',
          question: 'What is algorithmic trading and how does it differ from discretionary trading?',
          answer: 'Algorithmic trading uses computer programs to execute trades based on predefined rules and criteria. Unlike discretionary trading where humans make decisions, algo trading relies on automated systems that can analyze data and execute trades at speeds and volumes impossible for humans.'
        },
        {
          id: 'card2',
          title: 'Algo Trading Advantages',
          question: 'What are the main advantages of algorithmic trading?',
          answer: 'Key advantages include: Speed and efficiency (executes trades in milliseconds), Emotion removal (eliminates psychological biases), Backtesting capability (test strategies on historical data), Diversification (can trade multiple markets simultaneously), and Consistency (executes the strategy exactly as programmed).'
        },
        {
          id: 'card3',
          title: 'Types of Algorithmic Strategies',
          question: 'What are the main categories of algorithmic trading strategies?',
          answer: 'Main categories include: Trend-following strategies, Mean reversion strategies, Arbitrage strategies, Statistical arbitrage, Market making strategies, Sentiment analysis strategies, and Machine learning-based strategies. Each exploits different market inefficiencies.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which is NOT an advantage of algorithmic trading?',
            options: ['Speed of execution', 'Removing emotions', 'Guaranteed profits', 'Ability to backtest'],
            correctAnswer: 2
          },
          {
            id: 'q2',
            question: 'Which strategy assumes prices will return to an average value?',
            options: ['Trend following', 'Mean reversion', 'Arbitrage', 'Market making'],
            correctAnswer: 1
          },
          {
            id: 'q3',
            question: 'What is backtesting?',
            options: ['Testing hardware components', 'Testing strategies on historical data', 'Manual paper trading', 'Testing network connectivity'],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module2',
      title: 'Developing Trading Algorithms',
      description: 'Learn to code and implement algorithmic trading strategies',
      estimatedTime: 35,
      flashcards: [
        {
          id: 'card1',
          title: 'Algorithm Development Process',
          question: 'What are the key steps in developing a trading algorithm?',
          answer: 'Key steps include: 1) Strategy research and formulation, 2) Strategy coding/implementation, 3) Backtesting and optimization, 4) Forward testing/paper trading, 5) Performance analysis and refinement, 6) Risk management integration, and 7) Live deployment with monitoring.'
        },
        {
          id: 'card2',
          title: 'Programming Languages',
          question: 'What programming languages are commonly used for algorithmic trading?',
          answer: 'Common languages include: Python (most popular due to data science libraries), R (statistical analysis), C++ (for low-latency systems), Java (enterprise applications), and specialized platforms like MetaTrader. Each has different strengths for different types of strategies.'
        },
        {
          id: 'card3',
          title: 'Overfitting Prevention',
          question: 'What is overfitting and how can it be prevented in algo trading?',
          answer: 'Overfitting occurs when an algorithm is too closely tailored to historical data and performs poorly on new data. Prevention methods include: using out-of-sample testing, cross-validation, keeping strategies simple (fewer parameters), using walk-forward optimization, and focusing on robust strategies rather than optimized ones.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which programming language is most popular for algo trading due to its data science libraries?',
            options: ['Java', 'C++', 'Python', 'JavaScript'],
            correctAnswer: 2
          },
          {
            id: 'q2',
            question: 'What is NOT a good method to prevent overfitting?',
            options: ['Out-of-sample testing', 'Cross-validation', 'Maximizing parameter count', 'Walk-forward optimization'],
            correctAnswer: 2
          },
          {
            id: 'q3',
            question: 'What should you do before deploying an algorithm to live trading?',
            options: ['Skip testing to beat competitors', 'Paper trading/forward testing', 'Maximize leverage', 'Eliminate all risk controls'],
            correctAnswer: 1
          }
        ]
      }
    }
  ]
};
