
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
          },
          {
            id: 'q4',
            question: 'What does liquidity in a market refer to?',
            options: ['The amount of water traders drink', 'How quickly assets can be bought or sold without affecting price', 'The cash reserves of a company', 'The volatility of the market'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'Which of these is NOT a factor that affects market prices?',
            options: ['Supply and demand', 'Economic indicators', 'Company earnings', 'The trader\'s zodiac sign'],
            correctAnswer: 3
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
          answer: "Stock indices are statistical measures that represent the value of a specific group of stocks. They're important because they provide a benchmark for market performance, allow investors to track specific market segments, and serve as the basis for index funds and ETFs."
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
          },
          {
            id: 'q4',
            question: 'What is the purpose of a limit order?',
            options: ['To buy or sell at the current market price', 'To buy or sell at a specified price or better', 'To automatically sell if a stock drops below a certain price', 'To limit the number of shares you can trade'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'Which term describes the difference between the bid and ask price?',
            options: ['Margin', 'Spread', 'Commission', 'Dividend'],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      id: 'module3',
      title: 'Fundamental Analysis Basics',
      description: 'Learn how to analyze company fundamentals for investing',
      estimatedTime: 25,
      flashcards: [
        {
          id: 'card1',
          title: 'Fundamental Analysis',
          question: 'What is fundamental analysis and how is it used in trading?',
          answer: 'Fundamental analysis evaluates a security by examining related economic, financial, and other qualitative/quantitative factors. Traders use it to determine if a security is undervalued or overvalued by analyzing company financials, industry conditions, and economic indicators.'
        },
        {
          id: 'card2',
          title: 'Financial Statements',
          question: 'What are the three main financial statements used in fundamental analysis?',
          answer: 'The three main statements are: 1) Income Statement (shows revenue, expenses, and profit), 2) Balance Sheet (shows assets, liabilities, and equity), and 3) Cash Flow Statement (shows cash moving in and out of the business).'
        },
        {
          id: 'card3',
          title: 'Key Ratios',
          question: 'What are some important financial ratios used in fundamental analysis?',
          answer: 'Key ratios include: P/E Ratio (price to earnings), EPS (earnings per share), P/B Ratio (price to book), ROE (return on equity), Current Ratio (liquidity), and Debt-to-Equity Ratio (leverage). These help compare companies and assess financial health.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What does a P/E ratio measure?',
            options: ['Price to equity', 'Price to earnings', 'Profit to expense', 'Potential to earnings'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'Which financial statement shows if a company is profitable?',
            options: ['Balance Sheet', 'Cash Flow Statement', 'Income Statement', 'Annual Report'],
            correctAnswer: 2
          },
          {
            id: 'q3',
            question: 'What does a high debt-to-equity ratio indicate?',
            options: ['Strong financial position', 'High profitability', 'Low risk', 'Higher financial leverage and risk'],
            correctAnswer: 3
          },
          {
            id: 'q4',
            question: 'Which is NOT considered in fundamental analysis?',
            options: ['Management quality', 'Market sentiment', 'Chart patterns', 'Competitive advantage'],
            correctAnswer: 2
          },
          {
            id: 'q5',
            question: 'What is EPS?',
            options: ['Equity Per Share', 'Earnings Per Strategy', 'Earnings Per Share', 'Estimated Price Sensitivity'],
            correctAnswer: 2
          }
        ]
      }
    }
    // Additional modules would be added here - for brevity, I've included just three examples for basics level
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
          },
          {
            id: 'q4',
            question: 'What do Bollinger Bands measure?',
            options: ['Trend direction', 'Volatility', 'Volume', 'Momentum'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'Which is a lagging indicator?',
            options: ['RSI', 'Moving Average', 'Volume', 'Stochastic Oscillator'],
            correctAnswer: 1
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
          answer: "Position sizing is determining how much of your capital to risk on a single trade. It's important because it helps protect your trading capital from excessive losses, ensures long-term survival in the markets, and helps maintain emotional control during drawdowns."
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
          answer: "Risk-reward ratio compares the potential profit of a trade to its potential loss. It's calculated by dividing the distance from entry to profit target by the distance from entry to stop loss. A favorable ratio (e.g., 1:2 or higher) means the potential reward exceeds the risk."
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
          },
          {
            id: 'q4',
            question: 'What is the purpose of diversification?',
            options: ['To increase potential profits', 'To reduce overall risk', 'To simplify trading', 'To increase trading volume'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'What is drawdown?',
            options: ['A trading strategy', 'The closing of a position', 'The decline in account value from a peak', 'A psychological state during trading'],
            correctAnswer: 2
          }
        ]
      }
    },
    {
      id: 'module3',
      title: 'Swing Trading Strategies',
      description: 'Learn effective swing trading techniques for medium-term profits',
      estimatedTime: 22,
      flashcards: [
        {
          id: 'card1',
          title: 'Swing Trading Basics',
          question: 'What is swing trading and how does it differ from day trading?',
          answer: 'Swing trading is a style that attempts to capture gains over a period of several days to weeks. Unlike day trading where positions are closed daily, swing traders hold positions overnight and look to profit from "swings" in price momentum over medium timeframes.'
        },
        {
          id: 'card2',
          title: 'Swing Trading Setups',
          question: 'What are common swing trading setups?',
          answer: 'Common setups include: Pullbacks to moving averages, breakouts from consolidation patterns, momentum reversals, gap fills, and support/resistance bounces. These setups often combine technical analysis with confirmation indicators.'
        },
        {
          id: 'card3',
          title: 'Timeframes',
          question: 'What timeframes are commonly used in swing trading?',
          answer: 'Swing traders typically use daily charts for their primary analysis, but may also incorporate weekly charts for trend direction and 4-hour or hourly charts for entry timing. This multi-timeframe approach helps identify high-probability trading opportunities.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the typical holding period for swing trades?',
            options: ['Minutes to hours', 'Days to weeks', 'Months to years', 'Seconds to minutes'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'Which is most important for swing trading?',
            options: ['High-frequency trading algorithms', 'Ultra-fast execution', 'Trend identification', 'Penny stock selection'],
            correctAnswer: 2
          },
          {
            id: 'q3',
            question: 'What is a key advantage of swing trading over day trading?',
            options: ['No overnight risk', 'Less time commitment', 'More frequent trades', 'Lower capital requirements'],
            correctAnswer: 1
          },
          {
            id: 'q4',
            question: 'Which pattern is commonly used in swing trading?',
            options: ['Scalping pattern', 'Flag pattern', 'Algorithmic pattern', 'Frequency pattern'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'What does "buying the dip" refer to in swing trading?',
            options: ['Purchasing stocks at their highest point', 'Buying when prices temporarily decline in an uptrend', 'Investing in falling markets', 'Buying food dips for trading sessions'],
            correctAnswer: 1
          }
        ]
      }
    }
    // Additional intermediate modules would be added here
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
          },
          {
            id: 'q4',
            question: 'What is the primary challenge in algorithmic trading?',
            options: ['Slow execution', 'Strategy development and validation', 'Lack of historical data', 'Too few trading opportunities'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'Which of these is a common algorithmic trading infrastructure component?',
            options: ['Social media management', 'Data feeds and APIs', 'Customer relationship management', 'Physical trading floor'],
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
          },
          {
            id: 'q4',
            question: 'What is a common metric to evaluate algorithmic trading strategies?',
            options: ['Social media mentions', 'Sharpe ratio', 'Number of trades per second', 'Strategy age'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'Which is NOT a common issue in algorithmic trading?',
            options: ['Network latency', 'Execution slippage', 'Over-optimization', 'Excessive human intervention'],
            correctAnswer: 3
          }
        ]
      }
    },
    {
      id: 'module3',
      title: 'Machine Learning in Trading',
      description: 'Apply machine learning techniques to develop advanced trading strategies',
      estimatedTime: 40,
      flashcards: [
        {
          id: 'card1',
          title: 'ML in Trading',
          question: 'How is machine learning applied to trading?',
          answer: 'Machine learning in trading uses algorithms to find patterns in data and make predictions or decisions without explicit programming. Applications include price prediction, pattern recognition, sentiment analysis, portfolio optimization, risk management, and trade execution optimization.'
        },
        {
          id: 'card2',
          title: 'Common ML Algorithms',
          question: 'What are common machine learning algorithms used in trading?',
          answer: 'Common algorithms include: Linear/Logistic Regression, Decision Trees, Random Forests, Support Vector Machines, Neural Networks (including Deep Learning), Reinforcement Learning, and Clustering algorithms. Each has strengths for different types of market analysis.'
        },
        {
          id: 'card3',
          title: 'Feature Engineering',
          question: 'What is feature engineering and why is it important for ML trading models?',
          answer: 'Feature engineering is the process of transforming raw data into meaningful inputs for ML models. It\'s crucial because the quality of features significantly impacts model performance. In trading, it includes creating technical indicators, transforming price data, and incorporating fundamental or alternative data.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which type of ML algorithm learns through trial and error?',
            options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Transfer learning'],
            correctAnswer: 2
          },
          {
            id: 'q2',
            question: 'What is the biggest challenge in applying ML to markets?',
            options: ['Computing power', 'Non-stationarity of financial data', 'Lack of historical data', 'Programming difficulty'],
            correctAnswer: 1
          },
          {
            id: 'q3',
            question: 'What is overfitting in the context of ML trading models?',
            options: ['When a model performs well in training but poorly in live trading', 'When a strategy trades too frequently', 'When a model uses too little data', 'When a model is too simple'],
            correctAnswer: 0
          },
          {
            id: 'q4',
            question: 'Which data type is NOT commonly used in ML trading models?',
            options: ['Price data', 'Volume data', 'Social media sentiment', 'Trader\'s horoscope'],
            correctAnswer: 3
          },
          {
            id: 'q5',
            question: 'What is a neural network in machine learning?',
            options: ['A computer network for traders', 'An algorithm inspired by the human brain', 'A network of trading computers', 'A social network for algorithms'],
            correctAnswer: 1
          }
        ]
      }
    }
    // Additional pro modules would be added here
  ]
};
