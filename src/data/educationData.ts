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
  questions: QuizQuestion[];
};

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export type QuizAnswer = {
  id?: string;
  question_id?: string;
  answer_text: string;
  is_correct: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
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
        },
        {
          id: 'card4',
          title: 'Market Orders vs Limit Orders',
          question: 'What is the difference between market orders and limit orders?',
          answer: 'Market orders execute immediately at the current market price, guaranteeing execution but not price. Limit orders execute only at a specified price or better, guaranteeing price but not execution. Market orders are used when speed is important, while limit orders provide price control.'
        },
        {
          id: 'card5',
          title: 'Bull vs Bear Markets',
          question: 'What are bull and bear markets?',
          answer: 'A bull market is characterized by rising prices and optimism, typically defined as a 20% rise from recent lows. A bear market features falling prices and pessimism, typically defined as a 20% drop from recent highs. These terms reflect market sentiment and directional trends.'
        },
        {
          id: 'card6',
          title: 'Liquidity',
          question: 'What is market liquidity and why is it important?',
          answer: 'Liquidity refers to how easily an asset can be bought or sold without affecting its price. High liquidity means trades can be executed quickly with minimal price impact. Liquidity is important because it reduces transaction costs, provides price stability, and allows investors to enter or exit positions easily.'
        },
        {
          id: 'card7',
          title: 'Market Volatility',
          question: 'What is market volatility and how does it affect trading?',
          answer: 'Volatility measures the rate at which the price of an asset increases or decreases. High volatility indicates large price swings and increased risk, but also more trading opportunities. Low volatility indicates more stable prices. Traders adjust their strategies and risk management based on volatility levels.'
        },
        {
          id: 'card8',
          title: 'Trading vs Investing',
          question: 'How does trading differ from investing?',
          answer: 'Trading involves frequent buying and selling with the goal of short-term profits from price movements. Investing involves buying and holding assets for long-term growth and income. Traders focus on technical analysis and short-term patterns, while investors emphasize fundamentals and long-term value.'
        },
        {
          id: 'card9',
          title: 'Exchange Hours',
          question: 'What are typical market hours for major exchanges?',
          answer: 'The New York Stock Exchange (NYSE) and NASDAQ operate from 9:30 AM to 4:00 PM Eastern Time. The London Stock Exchange operates from 8:00 AM to 4:30 PM GMT. The Tokyo Stock Exchange operates from 9:00 AM to 3:00 PM JST. Forex markets operate 24 hours a day, 5 days a week.'
        },
        {
          id: 'card10',
          title: 'Bid-Ask Spread',
          question: 'What is the bid-ask spread?',
          answer: 'The bid-ask spread is the difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller is willing to accept (ask). A narrow spread indicates high liquidity, while a wide spread suggests low liquidity. The spread represents transaction costs for traders.'
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
            options: ['Supply and demand', 'Economic indicators', 'Company earnings', "The trader's zodiac sign"],
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
        },
        {
          id: 'card4',
          title: 'Market Capitalization',
          question: 'What is market capitalization and how is it calculated?',
          answer: "Market capitalization (market cap) is the total market value of a company's outstanding shares. It's calculated by multiplying the current share price by the total number of outstanding shares. Companies are often classified as large-cap (>$10B), mid-cap ($2-10B), or small-cap ($300M-2B) based on their market cap."
        },
        {
          id: 'card5',
          title: 'Primary vs. Secondary Markets',
          question: 'What is the difference between primary and secondary stock markets?',
          answer: 'The primary market is where new securities are issued and sold for the first time (IPOs). The secondary market is where existing securities are traded among investors. Companies raise capital in the primary market, while investors trade with each other in the secondary market.'
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
        },
        {
          id: 'card4',
          title: 'Income Statement Analysis',
          question: 'What are the key components of an income statement and what do they tell investors?',
          answer: 'Key components include: Revenue (total sales), Cost of Goods Sold (direct costs), Gross Profit (revenue minus COGS), Operating Expenses (indirect costs), Operating Income (profit from operations), and Net Income (final profit). They reveal profitability, growth, expense management, and overall financial performance.'
        },
        {
          id: 'card5',
          title: 'Balance Sheet Analysis',
          question: 'What are the key components of a balance sheet and what do they tell investors?',
          answer: "Key components include: Assets (what the company owns), Liabilities (what the company owes), and Shareholders' Equity (assets minus liabilities). The balance sheet reveals a company's financial position, debt levels, liquidity, and overall financial strength at a specific point in time."
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
1: 'What does a high debt-to-equity ratio indicate?',
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
        },
        {
          id: 'card4',
          title: 'Moving Averages',
          question: 'What are moving averages and how are they used in technical analysis?',
          answer: 'Moving averages calculate the average price over a specific time period, creating a smoothed price line. Simple Moving Averages (SMA) weigh all prices equally, while Exponential Moving Averages (EMA) give more weight to recent prices. They help identify trends, support/resistance levels, and potential entry/exit points when different periods cross.'
        },
        {
          id: 'card5',
          title: 'Relative Strength Index (RSI)',
          question: 'What is the RSI indicator and how is it interpreted?',
          answer: 'RSI is a momentum oscillator that measures the speed and magnitude of price movements on a scale from 0 to 100. Traditional interpretation considers readings above 70 as overbought (potential sell signal) and below 30 as oversold (potential buy signal). It can also show divergence when price and RSI move in opposite directions, signaling potential reversals.'
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
        },
        {
          id: 'card4',
          title: 'Maximum Drawdown',
          question: 'What is maximum drawdown and why does it matter?',
          answer: 'Maximum drawdown measures the largest peak-to-trough decline in account value. It represents the worst-case scenario historical loss and indicates the potential risk of a strategy. Traders use it to assess risk tolerance, compare strategies, and determine appropriate position sizing. Lower maximum drawdowns generally indicate more conservative strategies.'
        },
        {
          id: 'card5',
          title: 'Diversification',
          question: 'How does diversification reduce trading risk?',
          answer: 'Diversification involves spreading capital across different markets, sectors, strategies, or timeframes. It reduces risk because losses in one area can be offset by gains in another. Effective diversification requires investments with low correlation. However, over-diversification can dilute returns, so balance is key.'
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
        },
        {
          id: 'card4',
          title: 'Moving Average Strategies',
          question: 'How are moving averages used in swing trading?',
          answer: 'Swing traders use moving averages to identify trend direction, support/resistance levels, and entry/exit points. Common strategies include trading bounces off the 50-day or 200-day moving averages, entering when faster MAs cross above slower MAs (Golden Cross), and using MA slopes to confirm trend strength.'
        },
        {
          id: 'card5',
          title: 'Swing Trading Indicators',
          question: 'What technical indicators work well for swing trading?',
          answer: 'Effective swing trading indicators include: Moving Averages (identify trends), RSI (spot overbought/oversold conditions), MACD (confirm momentum), Bollinger Bands (measure volatility), and Volume indicators (confirm price movements). Most swing traders use multiple indicators for confirmation rather than relying on just one.'
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
        },
        {
          id: 'card4',
          title: 'Algorithmic Trading Infrastructure',
          question: 'What infrastructure components are needed for algorithmic trading?',
          answer: 'Key components include: Trading servers (high-performance computers), Data feeds (price, volume, order book data), Connectivity (low-latency network connections), Execution platforms (interfaces with exchanges), Risk management systems, Strategy development environment, and Backtesting/simulation software.'
        },
        {
          id: 'card5',
          title: 'Market Microstructure',
          question: 'What is market microstructure and why is it important for algo traders?',
          answer: 'Market microstructure studies how prices are formed through the trading process, including order types, bid-ask spreads, market depth, and order book dynamics. Algo traders need to understand it to optimize trade execution, minimize slippage, avoid market impact, and exploit short-term price inefficiencies.'
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
        },
        {
          id: 'card4',
          title: 'Quantitative Analysis Libraries',
          question: 'What are the key Python libraries used in quantitative trading?',
          answer: 'Key libraries include: NumPy and Pandas (data manipulation), Matplotlib and Seaborn (visualization), SciPy and Statsmodels (statistical analysis), Scikit-learn (machine learning), PyAlgoTrade/Backtrader/Zipline (backtesting), and API libraries for brokers and data providers (e.g., Interactive Brokers API, Alpaca, ccxt for crypto).'
        },
        {
          id: 'card5',
          title: 'Backtesting Frameworks',
          question: 'What features should a good backtesting framework provide?',
          answer: 'A good backtesting framework should provide: Historical data management, Strategy implementation flexibility, Realistic order execution modeling, Transaction cost modeling, Performance analytics, Risk metrics, Visualization tools, Walk-forward testing capability, and Parameter optimization functionality.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which language is most commonly used for algorithmic trading development?',
            options: ['JavaScript', 'Python', 'Ruby', 'PHP'],
            correctAnswer: 1
          },
          {
            id: 'q2',
            question: 'What is a key problem to avoid when developing trading algorithms?',
            options: ['Overfitting', 'Underfitting', 'Code optimization', 'Using too many libraries'],
            correctAnswer: 0
          },
          {
            id: 'q3',
            question: 'Which is NOT a step in the algorithm development process?',
            options: ['Strategy formulation', 'Backtesting', 'Social media promotion', 'Risk management integration'],
            correctAnswer: 2
          },
          {
            id: 'q4',
            question: 'What is walk-forward optimization?',
            options: ['A type of technical indicator', 'A way to test strategies on rolling time windows', 'A programming language', 'A trading platform'],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'Which Python library is primarily used for data manipulation in quant trading?',
            options: ['TensorFlow', 'Django', 'Pandas', 'Flask'],
            correctAnswer: 2
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
          title: 'Machine Learning in Trading',
          question: 'How is machine learning applied to trading?',
          answer: 'Machine learning is applied to trading for pattern recognition, market prediction, risk assessment, portfolio optimization, sentiment analysis, and algorithmic execution. It allows systems to adapt to changing market conditions by learning from historical and real-time data without being explicitly programmed for each scenario.'
        },
        {
          id: 'card2',
          title: 'Supervised vs. Unsupervised Learning',
          question: 'What is the difference between supervised and unsupervised learning in trading applications?',
          answer: 'In trading, supervised learning uses labeled historical data to train models that predict outcomes like price movements or risk levels. Unsupervised learning finds hidden patterns in unlabeled market data, such as identifying market regimes or correlations between assets without predefined classifications.'
        },
        {
          id: 'card3',
          title: 'Feature Engineering',
          question: 'What is feature engineering and why is it important in ML trading models?',
          answer: 'Feature engineering is the process of creating meaningful inputs for machine learning models from raw market data. It includes calculating technical indicators, transforming price data, creating time-based features, and encoding categorical variables. Good feature engineering is often more important than algorithm selection for trading success.'
        },
        {
          id: 'card4',
          title: 'Common ML Algorithms for Trading',
          question: 'What are some commonly used machine learning algorithms in trading?',
          answer: 'Common algorithms include: Linear/Logistic Regression (for simple relationships), Decision Trees and Random Forests (for non-linear patterns), Support Vector Machines (for classification), Neural Networks (for complex patterns), Reinforcement Learning (for optimal execution), and Clustering algorithms (for market regime identification).'
        },
        {
          id: 'card5',
          title: 'Model Evaluation',
          question: 'How are machine learning trading models evaluated?',
          answer: 'ML trading models are evaluated using: Traditional metrics (accuracy, precision, recall), Financial metrics (Sharpe ratio, drawdown, profit factor), Walk-forward testing, Monte Carlo simulations, Sensitivity analysis, and Out-of-sample testing to verify they generalize well to new market conditions. The ultimate test is consistent profitability with acceptable risk.'
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'Which type of machine learning tries to maximize rewards through actions?',
            options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Transfer learning'],
            correctAnswer: 2
          },
          {
            id: 'q2',
            question: 'What is a key challenge in applying machine learning to financial markets?',
            options: ['Too little data', 'Non-stationarity of markets', 'Lack of computing power', 'Too few algorithms available'],
            correctAnswer: 1
          },
          {
            id: 'q3',
            question: 'What is feature engineering in the context of trading algorithms?',
            options: ['Building trading platforms', 'Creating meaningful inputs from raw market data', 'Engineering faster execution systems', 'Designing user interfaces'],
            correctAnswer: 1
          },
          {
            id: 'q4',
            question: 'Which metric is most commonly used to evaluate risk-adjusted returns?',
            options: ['Sharpe ratio', 'Accuracy', 'Standard deviation', 'F1 score'],
            correctAnswer: 0
          },
          {
            id: 'q5',
            question: 'Which algorithm type is best for identifying different market regimes?',
            options: ['Linear regression', 'Clustering algorithms', 'Simple moving averages', 'Bollinger bands'],
            correctAnswer: 1
          }
        ]
      }
    }
  ]
};
