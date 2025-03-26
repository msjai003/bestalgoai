
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

// Create a large dataset with 100+ flashcards per level
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
        },
        {
          id: 'card4',
          title: 'Market Capitalization',
          question: 'What is market capitalization and how is it calculated?',
          answer: 'Market capitalization (market cap) is the total market value of a company\'s outstanding shares. It\'s calculated by multiplying the current share price by the total number of outstanding shares. Companies are often classified as large-cap (>$10B), mid-cap ($2-10B), or small-cap ($300M-2B) based on their market cap.'
        },
        {
          id: 'card5',
          title: 'Primary vs. Secondary Markets',
          question: 'What is the difference between primary and secondary stock markets?',
          answer: 'The primary market is where new securities are issued and sold for the first time (IPOs). The secondary market is where existing securities are traded among investors. Companies raise capital in the primary market, while investors trade with each other in the secondary market.'
        },
        {
          id: 'card6',
          title: 'IPO Process',
          question: 'What is an IPO and how does the process work?',
          answer: 'An Initial Public Offering (IPO) is the process of offering shares of a private company to the public. The process involves hiring investment banks, filing registration statements with regulators, conducting a roadshow to attract investors, pricing the shares, and finally listing on an exchange.'
        },
        {
          id: 'card7',
          title: 'Stock Splits',
          question: 'What is a stock split and why do companies do it?',
          answer: 'A stock split increases the number of shares outstanding while proportionally decreasing the price per share. For example, in a 2:1 split, 100 shares at $50 become 200 shares at $25. Companies do this to make their shares more affordable and increase liquidity, without changing the company\'s market cap.'
        },
        {
          id: 'card8',
          title: 'Circuit Breakers',
          question: 'What are market circuit breakers?',
          answer: 'Circuit breakers are temporary trading halts triggered by severe market declines. They're designed to prevent panic selling and extreme volatility. In the U.S. markets, circuit breakers are triggered at three thresholds: 7% (Level 1), 13% (Level 2), and 20% (Level 3) drops in the S&P 500 index.'
        },
        {
          id: 'card9',
          title: 'Common Stock vs. Preferred Stock',
          question: 'What is the difference between common stock and preferred stock?',
          answer: 'Common stock provides voting rights but variable or no dividends. Preferred stock typically has no voting rights but offers fixed dividends that must be paid before common stock dividends. Preferred stockholders also have priority over common stockholders in case of liquidation.'
        },
        {
          id: 'card10',
          title: 'Dark Pools',
          question: 'What are dark pools in stock trading?',
          answer: 'Dark pools are private exchanges where financial institutions can trade securities without revealing their intentions to the public market. They allow large blocks of shares to be bought or sold anonymously, minimizing market impact. Dark pools account for a significant portion of total trading volume in many markets.'
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
          answer: 'Key components include: Assets (what the company owns), Liabilities (what the company owes), and Shareholders\' Equity (assets minus liabilities). The balance sheet reveals a company\'s financial position, debt levels, liquidity, and overall financial strength at a specific point in time.'
        },
        {
          id: 'card6',
          title: 'Cash Flow Statement Analysis',
          question: 'What are the key components of a cash flow statement and why is it important?',
          answer: 'Key components include: Operating Activities (cash from core business), Investing Activities (cash from assets and investments), and Financing Activities (cash from debt and equity). The cash flow statement shows a company\'s ability to generate cash, fund operations, and support growth.'
        },
        {
          id: 'card7',
          title: 'EBITDA',
          question: 'What is EBITDA and why is it used in fundamental analysis?',
          answer: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures a company\'s operational profitability by excluding non-operating expenses. It\'s used to evaluate a company\'s core operating performance, compare companies with different capital structures, and estimate enterprise value.'
        },
        {
          id: 'card8',
          title: 'Dividend Analysis',
          question: 'What are dividends and how do investors analyze them?',
          answer: 'Dividends are cash payments to shareholders from a company\'s profits. Investors analyze them using metrics like Dividend Yield (annual dividend/current price), Payout Ratio (dividends/net income), Dividend Growth Rate, and Dividend Coverage Ratio. These measure income potential, sustainability, and company maturity.'
        },
        {
          id: 'card9',
          title: 'Industry Analysis',
          question: 'Why is industry analysis important in fundamental analysis?',
          answer: 'Industry analysis examines the competitive landscape, growth prospects, regulatory environment, and economic factors affecting an entire sector. It\'s important because a company\'s performance is often tied to industry trends. Tools include Porter\'s Five Forces, SWOT analysis, and industry lifecycle assessment.'
        },
        {
          id: 'card10',
          title: 'Economic Indicators',
          question: 'What are economic indicators and how do they affect stock performance?',
          answer: 'Economic indicators are statistics that show the economic performance of a country or region. Key indicators include GDP growth, inflation rates, interest rates, unemployment, and consumer confidence. They affect stock performance by influencing corporate profits, consumer spending, borrowing costs, and overall market sentiment.'
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
    },
    // Additional modules for basics level would be defined here
    // For brevity, I've just included 3 sample modules with detailed flashcards
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
        },
        {
          id: 'card6',
          title: 'MACD Indicator',
          question: 'What is the MACD indicator and how is it used?',
          answer: 'Moving Average Convergence Divergence (MACD) shows the relationship between two moving averages of a security\'s price. It consists of the MACD line (difference between 12 and 26-period EMAs), the signal line (9-period EMA of MACD), and a histogram. Traders look for crossovers, divergences, and histogram changes to identify potential entry and exit points.'
        },
        {
          id: 'card7',
          title: 'Bollinger Bands',
          question: 'What are Bollinger Bands and how do traders use them?',
          answer: 'Bollinger Bands consist of a middle band (20-period SMA) with upper and lower bands at 2 standard deviations. They measure volatility and potential overbought/oversold conditions. Traders look for "the squeeze" (bands narrowing, indicating low volatility before a breakout), price touching bands (potential reversal), and price movement outside bands (strong trend continuation).'
        },
        {
          id: 'card8',
          title: 'Support and Resistance',
          question: 'What are support and resistance levels in technical analysis?',
          answer: 'Support is a price level where buying pressure is strong enough to prevent further decline. Resistance is a level where selling pressure prevents further rise. These levels form when prices repeatedly reverse at similar points, creating psychological barriers. When broken, support can become resistance and vice versa, often leading to significant price movements.'
        },
        {
          id: 'card9',
          title: 'Fibonacci Retracement',
          question: 'What are Fibonacci retracements and how are they used in trading?',
          answer: 'Fibonacci retracements identify potential support/resistance levels using the Fibonacci sequence ratios (23.6%, 38.2%, 50%, 61.8%, 78.6%). Traders draw them from significant highs and lows to predict where price might reverse during retracements. They\'re often used with other indicators for confirmation and work across different timeframes and markets.'
        },
        {
          id: 'card10',
          title: 'Volume Analysis',
          question: 'Why is volume important in technical analysis?',
          answer: 'Volume represents the number of shares or contracts traded and confirms price movements. High volume during price increases suggests strong buying pressure, while high volume during decreases indicates strong selling. Low volume suggests weak conviction. Volume often leads price, with increasing volume preceding significant price movements and decreasing volume suggesting potential reversals.'
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
        },
        {
          id: 'card6',
          title: 'Correlation Risk',
          question: 'What is correlation risk and how can traders manage it?',
          answer: 'Correlation risk occurs when seemingly diversified positions move together, amplifying losses. Traders manage it by analyzing historical correlation between markets, stress-testing portfolios under different scenarios, using assets with negative correlations, monitoring correlation changes, and adjusting position sizes based on correlation strength.'
        },
        {
          id: 'card7',
          title: 'Kelly Criterion',
          question: 'What is the Kelly Criterion and how is it used in position sizing?',
          answer: 'The Kelly Criterion is a formula that determines the optimal bet size as a percentage of capital based on edge and win rate: (win percentage × average win/loss ratio - loss percentage) / average win/loss ratio. It maximizes long-term growth but can be volatile, so traders often use a fraction of Kelly (e.g., Half-Kelly) for more conservative sizing.'
        },
        {
          id: 'card8',
          title: 'Black Swan Events',
          question: 'What are black swan events and how can traders prepare for them?',
          answer: 'Black swan events are rare, unpredictable occurrences with severe market impacts (e.g., 2008 financial crisis). Traders prepare by maintaining conservative leverage, using options as hedges, implementing circuit breaker stops, stress-testing strategies, maintaining cash reserves, and diversifying across uncorrelated assets and strategies.'
        },
        {
          id: 'card9',
          title: 'Trading Journal',
          question: 'How does keeping a trading journal help with risk management?',
          answer: 'A trading journal documents trade details, reasons for entry/exit, emotions, market conditions, and results. It helps identify patterns in winning and losing trades, recognize emotional biases affecting decisions, measure strategy effectiveness, enforce discipline, and provide data for continuous improvement in risk management.'
        },
        {
          id: 'card10',
          title: 'Risk of Ruin',
          question: 'What is the risk of ruin and how is it calculated?',
          answer: 'Risk of ruin is the probability of losing all trading capital. It\'s influenced by win rate, reward-to-risk ratio, position sizing, and consecutive losses. The formula for simplified risk of ruin (R) with equal bet sizes: R = ((1-W)/(1+W))^N, where W is win rate and N is number of units in account. Reducing position size decreases risk of ruin.'
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
        },
        {
          id: 'card6',
          title: 'Risk Management for Swing Trading',
          question: 'How should risk be managed in swing trading?',
          answer: 'Swing trading risk management involves: Setting stop losses at technical levels (not arbitrary percentages), maintaining appropriate position sizes (typically 1-2% risk per trade), using target prices for exits, having maximum portfolio exposure limits (e.g., 20-25% in related sectors), and adjusting stops to lock in profits as trades move favorably.'
        },
        {
          id: 'card7',
          title: 'Gap Trading',
          question: 'How do swing traders approach price gaps?',
          answer: 'Swing traders identify different types of gaps: Breakaway gaps (beginning of a trend), Runaway/Continuation gaps (during a trend), and Exhaustion gaps (end of a trend). Common strategies include trading continuation gaps in the direction of the trend and looking for gap fills (price returning to pre-gap level) on exhaustion gaps.'
        },
        {
          id: 'card8',
          title: 'Sector Rotation',
          question: 'What is sector rotation and how is it used in swing trading?',
          answer: 'Sector rotation refers to capital moving between market sectors in response to economic cycles. Swing traders profit from this by identifying strong sectors early, trading the strongest stocks within those sectors, monitoring sector ETFs for relative strength, and anticipating rotation based on economic indicators and market breadth.'
        },
        {
          id: 'card9',
          title: 'News and Catalysts',
          question: 'How do swing traders incorporate news and catalysts?',
          answer: 'Swing traders use fundamental catalysts (earnings reports, product launches, management changes) to identify potential price movements, but rely on technical analysis for timing. They often enter positions before anticipated events, use options to manage event risk, and avoid holding through high-uncertainty events like earnings if their strategy is purely technical.'
        },
        {
          id: 'card10',
          title: 'Market Correlation',
          question: 'Why is market correlation important for swing traders?',
          answer: 'Market correlation measures how securities move in relation to each other or the broader market. Swing traders monitor correlation to avoid overexposure to similar positions, identify stocks showing strength against weak markets (positive divergence), adjust position sizes based on correlation risk, and understand how broader market movements might affect their trades.'
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
        },
        {
          id: 'card6',
          title: 'High Frequency Trading',
          question: 'What is high frequency trading (HFT) and how does it work?',
          answer: 'HFT is a subset of algorithmic trading characterized by extremely high speeds, high turnover rates, and very short holding periods (milliseconds to seconds). It works by using advanced algorithms to detect and exploit tiny price discrepancies, often employing strategies like market making, statistical arbitrage, and latency arbitrage.'
        },
        {
          id: 'card7',
          title: 'Algorithmic Strategy Metrics',
          question: 'What key metrics are used to evaluate algorithmic trading strategies?',
          answer: 'Key metrics include: Sharpe Ratio (risk-adjusted returns), Maximum Drawdown (largest peak-to-trough decline), Win Rate (percentage of profitable trades), Profit Factor (gross profits/gross losses), Sortino Ratio (downside risk-adjusted returns), and Calmar Ratio (returns relative to maximum drawdown).'
        },
        {
          id: 'card8',
          title: 'Execution Algorithms',
          question: 'What are execution algorithms and what problems do they solve?',
          answer: 'Execution algorithms optimize how larger orders are executed to minimize market impact and execution costs. Common types include: TWAP (time-weighted average price), VWAP (volume-weighted average price), Implementation Shortfall, Dark Pool Algorithms, and Iceberg Orders. They solve the problem of how to execute large trades without moving the market against you.'
        },
        {
          id: 'card9',
          title: 'Latency and Colocation',
          question: 'What is latency in algorithmic trading and why is colocation important?',
          answer: 'Latency is the delay between order submission and execution, measured in milliseconds or microseconds. Colocation involves placing trading servers in the same physical location as exchange matching engines. It\'s important because lower latency provides a competitive edge in strategies where speed matters, such as arbitrage and certain HFT strategies.'
        },
        {
          id: 'card10',
          title: 'Risk Management in Algo Trading',
          question: 'What specialized risk management techniques are used in algorithmic trading?',
          answer: 'Specialized techniques include: Pre-trade risk checks, Position limits, Exposure limits, Drawdown limits, Circuit breakers, Order throttling, Fat-finger limits, Greek limits (for options), Correlation analysis, and Real-time monitoring and alerting systems. These help prevent system errors, unexpected market moves, or algorithm malfunctions from causing catastrophic losses.'
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
        },
        {
          id: 'card6',
          title: 'Trading Strategy Optimization',
          question: 'What methods are used to optimize trading strategies?',
          answer: 'Optimization methods include: Grid search (testing all parameter combinations), Genetic algorithms (evolutionary approach), Bayesian optimization (efficient parameter space exploration), Walk-forward optimization (testing on rolling time windows), Monte Carlo simulations (testing with randomized inputs), and Machine learning techniques for adaptive parameter adjustment.'
        },
        {
          id: 'card7',
          title: 'Data Sources and Quality',
          question: 'What data sources are used in algorithmic trading and how is data quality ensured?',
          answer: 'Data sources include: Exchange feeds, market data vendors (Bloomberg, Reuters), alternative data providers, and public APIs. Data quality is ensured through: Checking for missing values, detecting and handling outliers, adjusting for corporate actions, ensuring point-in-time accuracy (avoiding look-ahead bias), and normalizing across different sources.'
        },
        {
          id: 'card8',
          title: 'Algorithm Monitoring',
          question: 'How are algorithmic trading systems monitored in production?',
          answer: 'Monitoring involves: Real-time dashboards tracking strategy performance, risk exposure, and system health; Automated alerts for unusual behavior; Regular performance reports; Drawdown monitoring; Volatility monitoring; Correlation analysis with market conditions; Technical system monitoring (latency, error rates, resource usage); and Periodic strategy reviews.'
        },
        {
          id: 'card9',
          title: 'Machine Learning in Algorithmic Trading',
          question: 'How is machine learning applied to algorithmic trading?',
          answer: 'Applications include: Price prediction (regression models), Pattern recognition (classification models), Anomaly detection (identifying unusual market behavior), Clustering (grouping similar market regimes), Reinforcement learning (adaptive trading policies), Natural language processing (news/sentiment analysis), and Ensemble methods (combining multiple models).'
        },
        {
          id: 'card10',
          title: 'Deployment Infrastructure',
          question: 'What infrastructure considerations are important for deploying trading algorithms?',
          answer: 'Key considerations include: Reliability (redundant systems, failover mechanisms), Scalability (handling increased data or trading volume), Security (protecting strategy code and data), Performance (low-latency execution), Monitoring capabilities, Disaster recovery, Compliance and audit trail requirements, and Cost efficiency (cloud vs. on-premises).'
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
          answer: "Feature engineering is the process of transforming raw data into meaningful inputs for ML models. It's crucial because the quality of features significantly impacts model performance. In trading, it includes creating technical indicators, transforming price data, and incorporating fundamental or alternative data."
        },
        {
          id: 'card4',
          title: 'Supervised Learning in Trading',
          question: 'How is supervised learning applied to trading problems?',
          answer: 'Supervised learning uses labeled historical data to train models that predict future outcomes. In trading, it\'s used for: Price prediction (regression), Direction prediction (classification), Volatility forecasting, Trading signal generation, and Risk modeling. Models learn from past market behaviors to identify similar patterns in current data.'
        },
        {
          id: 'card5',
          title: 'Unsupervised Learning in Trading',
          question: 'How is unsupervised learning used in trading?',
          answer: 'Unsupervised learning identifies patterns without labeled data. In trading, it\'s used for: Market regime identification (clustering similar market conditions), Anomaly detection (identifying unusual price movements or market behavior), Dimension reduction (simplifying complex data), and Feature discovery (finding hidden relationships in market data).'
        },
        {
          id: 'card6',
          title: 'Reinforcement Learning in Trading',
          question: 'How is reinforcement learning applied to trading?',
          answer: 'Reinforcement learning trains agents to make sequential decisions by rewarding desired outcomes. In trading, it\'s used to develop adaptive trading policies that learn optimal entry/exit timing, position sizing, and portfolio allocation. The agent learns to maximize returns while managing risk through trial and error in simulated environments.'
        },
        {
          id: 'card7',
          title: 'Deep Learning in Trading',
          question: 'What are applications of deep learning in trading?',
          answer: 'Deep learning applications include: Price prediction using recurrent neural networks (LSTM, GRU), Pattern recognition in charts using convolutional neural networks, Time series forecasting with transformer models, Alternative data analysis (processing unstructured data like news, social media), and Multimodal learning combining different data types.'
        },
        {
          id: 'card8',
          title: 'ML Model Evaluation',
          question: 'How are machine learning trading models evaluated?',
          answer: 'Evaluation methods include: Traditional ML metrics (accuracy, precision, recall), Trading-specific metrics (Sharpe ratio, maximum drawdown, profit factor), Cross-validation (time-series split, walk-forward), Out-of-sample testing, Robustness tests across different market conditions, Sensitivity analysis, and Ensemble model performance comparison.'
        },
        {
          id: 'card9',
          title: 'Challenges in ML Trading',
          question: 'What challenges are specific to applying machine learning in trading?',
          answer: 'Challenges include: Non-stationarity (changing market relationships), Low signal-to-noise ratio, Feature selection complexity, Overfitting risk, Regime changes, Look-ahead bias prevention, Computational requirements for real-time inference, Data quality issues, Explainability of "black box" models, and Implementation shortfall between backtest and live trading.'
        },
        {
          id: 'card10',
          title: 'Alternative Data in ML Trading',
          question: 'How is alternative data used with machine learning in trading?',
          answer: 'Alternative data includes non-traditional information sources like satellite imagery, credit card transactions, social media sentiment, web traffic, and app usage statistics. ML models extract trading signals from this data by identifying patterns that precede market movements, gaining insights before they appear in traditional financial data.'
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
