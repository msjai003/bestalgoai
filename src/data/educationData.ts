
export interface FlashCard {
  id: string;
  front: string;
  back: string;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'basics' | 'intermediate' | 'pro';
  flashcards: FlashCard[];
  quiz: QuizQuestion[];
}

export interface EducationData {
  basics: EducationModule[];
  intermediate: EducationModule[];
  pro: EducationModule[];
}

export const educationData: EducationData = {
  basics: [
    {
      id: "module1",
      title: "Introduction to Trading",
      description: "Learn the fundamentals of financial markets and trading.",
      icon: "📊",
      level: "basics",
      flashcards: [
        {
          id: "b1-card1",
          front: "What is a financial market?",
          back: "A financial market is a marketplace where buyers and sellers participate in the trade of assets such as equities, bonds, currencies and derivatives."
        },
        {
          id: "b1-card2",
          front: "What is the difference between stocks and bonds?",
          back: "Stocks represent ownership in a company, while bonds are debt instruments where investors lend money to an entity (corporate or governmental) for a defined period of time at a variable or fixed interest rate."
        },
        {
          id: "b1-card3",
          front: "What is a bull market?",
          back: "A bull market is a financial market of a group of securities in which prices are rising or are expected to rise. It's typically associated with increasing investor confidence."
        }
      ],
      quiz: [
        {
          id: "b1-q1",
          question: "What does it mean when someone is 'bullish' on a stock?",
          options: [
            "They expect the price to rise",
            "They expect the price to fall",
            "They are uncertain about the stock",
            "They are selling the stock"
          ],
          correctAnswer: 0,
          explanation: "Being 'bullish' means you expect prices to rise. The term comes from the way bulls attack - thrusting upward with their horns."
        },
        {
          id: "b1-q2",
          question: "Which of these is NOT a major global stock exchange?",
          options: [
            "London Stock Exchange",
            "New York Stock Exchange",
            "European Central Exchange",
            "Tokyo Stock Exchange"
          ],
          correctAnswer: 2,
          explanation: "The European Central Exchange doesn't exist. The major global exchanges include NYSE, NASDAQ, London Stock Exchange, Tokyo Stock Exchange, and Shanghai Stock Exchange."
        },
        {
          id: "b1-q3",
          question: "What is market capitalization?",
          options: [
            "The total number of shares a company has issued",
            "The total dollar value of a company's outstanding shares",
            "The maximum price a stock has reached",
            "The daily trading volume of a stock"
          ],
          correctAnswer: 1,
          explanation: "Market capitalization (or market cap) is calculated by multiplying a company's outstanding shares by the current market price of one share."
        }
      ]
    },
    {
      id: "module2",
      title: "Chart Types",
      description: "Understand different chart types used in market analysis.",
      icon: "📈",
      level: "basics",
      flashcards: [
        {
          id: "b2-card1",
          front: "What is a line chart?",
          back: "A line chart is the simplest form of chart, showing a line connecting the closing prices over a specified time period."
        },
        {
          id: "b2-card2",
          front: "What information does a candlestick chart show?",
          back: "A candlestick chart shows the open, high, low, and closing prices for each time period. The body represents the open and close prices, while the wicks show the high and low."
        },
        {
          id: "b2-card3",
          front: "What is the advantage of a bar chart?",
          back: "Bar charts (OHLC) display the open, high, low, and closing prices in a format that emphasizes the relationship between opening and closing prices, making them useful for analyzing price patterns."
        }
      ],
      quiz: [
        {
          id: "b2-q1",
          question: "What does a green (or white) candlestick typically indicate?",
          options: [
            "The closing price was higher than the opening price",
            "The closing price was lower than the opening price",
            "The stock didn't trade that day",
            "There was high volatility during the session"
          ],
          correctAnswer: 0,
          explanation: "A green (or white in traditional Japanese candlesticks) indicates that the closing price was higher than the opening price - a bullish (up) move."
        },
        {
          id: "b2-q2",
          question: "Which chart type shows the least amount of price information?",
          options: [
            "Line chart",
            "Bar chart",
            "Candlestick chart",
            "Point and Figure chart"
          ],
          correctAnswer: 0,
          explanation: "Line charts typically only show closing prices, without information about opening, high, or low prices for each period."
        },
        {
          id: "b2-q3",
          question: "What are the 'wicks' or 'shadows' on a candlestick chart?",
          options: [
            "The gap between trading sessions",
            "The lines extending above and below the body showing high and low prices",
            "The volume indicators",
            "The predicted future price movement"
          ],
          correctAnswer: 1,
          explanation: "The wicks (or shadows) extend from the body of the candlestick and represent the high and low prices reached during the trading period."
        }
      ]
    },
    {
      id: "module3",
      title: "Candlestick Patterns",
      description: "Learn to identify and interpret candlestick patterns.",
      icon: "🕯️",
      level: "basics",
      flashcards: [
        {
          id: "b3-card1",
          front: "What is a doji candlestick?",
          back: "A doji forms when a security's open and close are virtually equal. It indicates market indecision and potential reversal points."
        },
        {
          id: "b3-card2",
          front: "What does the 'Hammer' pattern indicate?",
          back: "The Hammer is a bullish reversal pattern that forms during a downtrend. It has a small body at the upper end of the trading range with a long lower shadow."
        },
        {
          id: "b3-card3",
          front: "What is an 'Engulfing' pattern?",
          back: "An engulfing pattern is a reversal pattern that forms when a small candle is completely engulfed by the following larger candle in the opposite direction."
        }
      ],
      quiz: [
        {
          id: "b3-q1",
          question: "Which candlestick pattern is characterized by a small body with long shadows on both sides?",
          options: [
            "Doji",
            "Hammer",
            "Engulfing",
            "Shooting Star"
          ],
          correctAnswer: 0,
          explanation: "A doji has a very small body (open and close are nearly equal) with shadows extending on both sides, indicating indecision in the market."
        },
        {
          id: "b3-q2",
          question: "What does a bullish engulfing pattern indicate?",
          options: [
            "Continuation of a downtrend",
            "Potential reversal from downtrend to uptrend",
            "Market indecision",
            "Low trading volume"
          ],
          correctAnswer: 1,
          explanation: "A bullish engulfing pattern occurs at the end of a downtrend when a down candle is followed by a larger up candle that completely 'engulfs' the previous candle, signaling a potential reversal to an uptrend."
        },
        {
          id: "b3-q3",
          question: "Which pattern is considered bearish?",
          options: [
            "Hammer",
            "Morning Star",
            "Shooting Star",
            "Bullish Harami"
          ],
          correctAnswer: 2,
          explanation: "A Shooting Star is a bearish reversal pattern with a small body at the lower end of the trading range and a long upper shadow, indicating selling pressure."
        }
      ]
    }
  ],
  intermediate: [
    {
      id: "module1",
      title: "Technical Indicators",
      description: "Learn about popular technical indicators and their applications.",
      icon: "📉",
      level: "intermediate",
      flashcards: [
        {
          id: "i1-card1",
          front: "What is a Moving Average (MA)?",
          back: "A Moving Average is a calculation used to analyze data points by creating a series of averages of different subsets of the full data set. It's used to smooth out short-term fluctuations and highlight longer-term trends or cycles."
        },
        {
          id: "i1-card2",
          front: "How does the Relative Strength Index (RSI) work?",
          back: "RSI is a momentum oscillator that measures the speed and change of price movements on a scale from 0 to 100. Traditional interpretation considers RSI above 70 as overbought and below 30 as oversold."
        },
        {
          id: "i1-card3",
          front: "What is the MACD indicator?",
          back: "Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price. It's calculated by subtracting the 26-period EMA from the 12-period EMA."
        }
      ],
      quiz: [
        {
          id: "i1-q1",
          question: "Which of these is NOT a type of moving average?",
          options: [
            "Simple Moving Average (SMA)",
            "Exponential Moving Average (EMA)",
            "Linear Weighted Moving Average (LWMA)",
            "Relative Moving Average (RMA)"
          ],
          correctAnswer: 3,
          explanation: "Relative Moving Average (RMA) is not a standard type of moving average. The common types are Simple Moving Average (SMA), Exponential Moving Average (EMA), and Weighted Moving Average (WMA)."
        },
        {
          id: "i1-q2",
          question: "What does an RSI reading above 70 typically indicate?",
          options: [
            "The asset is oversold",
            "The asset is overbought",
            "Strong bullish momentum will continue",
            "The price will definitely reverse"
          ],
          correctAnswer: 1,
          explanation: "An RSI reading above 70 is typically considered overbought, suggesting that the asset may be priced too high and could be due for a price correction or pullback."
        },
        {
          id: "i1-q3",
          question: "What is the signal line in MACD?",
          options: [
            "The difference between the 12-period and 26-period EMAs",
            "A 9-period EMA of the MACD line",
            "The zero line in the indicator",
            "The histogram showing momentum"
          ],
          correctAnswer: 1,
          explanation: "The signal line in MACD is typically a 9-period EMA of the MACD line itself. Crossovers between the MACD line and signal line are often used to generate buy and sell signals."
        }
      ]
    },
    {
      id: "module2",
      title: "Price Action Trading",
      description: "Master the art of reading and trading based on price movements.",
      icon: "🔍",
      level: "intermediate",
      flashcards: [
        {
          id: "i2-card1",
          front: "What is price action trading?",
          back: "Price action trading is a strategy that relies on analyzing the movement of prices on a chart, without using indicators. It focuses on patterns, trend lines, support and resistance levels, and candlestick formations."
        },
        {
          id: "i2-card2",
          front: "What is a 'swing high' and 'swing low'?",
          back: "A swing high is a peak formed when a price rises and then falls, with higher highs on either side. A swing low is a trough formed when a price falls and then rises, with lower lows on either side."
        },
        {
          id: "i2-card3",
          front: "What is a 'false breakout'?",
          back: "A false breakout occurs when the price temporarily breaks above a resistance level or below a support level but quickly reverses, failing to sustain the breakout. It often traps traders who entered positions expecting the breakout to continue."
        }
      ],
      quiz: [
        {
          id: "i2-q1",
          question: "What is the benefit of price action trading compared to indicator-based trading?",
          options: [
            "It always produces better results",
            "It requires less screen time",
            "It reduces lag since it's based on actual price movements rather than calculations from past data",
            "It is easier for beginners"
          ],
          correctAnswer: 2,
          explanation: "Price action trading reduces lag since it focuses on actual price movements rather than indicators, which are typically calculated from past price data and can lag behind current market conditions."
        },
        {
          id: "i2-q2",
          question: "What is a 'pin bar' in price action trading?",
          options: [
            "A candlestick with no body",
            "A candlestick with a long wick/shadow and small body, suggesting rejection of prices",
            "A chart pattern showing a transition between bullish and bearish markets",
            "A technical indicator measuring price volatility"
          ],
          correctAnswer: 1,
          explanation: "A pin bar is a candlestick with a small body and a long wick/shadow (or 'tail') on one side. It indicates rejection of prices at a certain level and often signals a potential reversal in price direction."
        },
        {
          id: "i2-q3",
          question: "What does 'inside bar' pattern indicate?",
          options: [
            "Increasing volatility",
            "Decreasing volatility and potential breakout",
            "Certain price reversal",
            "Strong trend continuation"
          ],
          correctAnswer: 1,
          explanation: "An inside bar pattern (where a bar is completely contained within the range of the previous bar) indicates decreasing volatility and consolidation. It often precedes a volatility expansion or breakout."
        }
      ]
    },
    {
      id: "module3",
      title: "Risk Management",
      description: "Learn essential risk management strategies for successful trading.",
      icon: "🛡️",
      level: "intermediate",
      flashcards: [
        {
          id: "i3-card1",
          front: "What is position sizing?",
          back: "Position sizing is determining the amount of money to risk on each trade, typically expressed as a percentage of your total trading capital."
        },
        {
          id: "i3-card2",
          front: "What is the 2% risk rule?",
          back: "The 2% risk rule suggests that traders should not risk more than 2% of their trading account on a single trade. This helps preserve capital during losing streaks."
        },
        {
          id: "i3-card3",
          front: "What is a risk-to-reward ratio?",
          back: "The risk-to-reward ratio compares the potential profit of a trade to its potential loss. A 1:3 risk-to-reward ratio means you're risking $1 to potentially make $3."
        }
      ],
      quiz: [
        {
          id: "i3-q1",
          question: "If you have a $10,000 account and follow the 2% risk rule, what's the maximum amount you should risk on a single trade?",
          options: [
            "$100",
            "$200",
            "$500",
            "$1,000"
          ],
          correctAnswer: 1,
          explanation: "Following the 2% risk rule with a $10,000 account means you should risk no more than $200 per trade (2% of $10,000 = $200)."
        },
        {
          id: "i3-q2",
          question: "What is a favorable risk-to-reward ratio?",
          options: [
            "3:1 (risk 3 to make 1)",
            "1:1 (risk 1 to make 1)",
            "1:2 (risk 1 to make 2)",
            "2:1 (risk 2 to make 1)"
          ],
          correctAnswer: 2,
          explanation: "A 1:2 ratio or better (like 1:3) is considered favorable because you're risking less to potentially gain more. This means you can be right less than 50% of the time and still be profitable."
        },
        {
          id: "i3-q3",
          question: "What is correlation risk in portfolio management?",
          options: [
            "The risk of trades performing worse than expected",
            "The risk of systems failure affecting your trades",
            "The risk of holding multiple positions that may lose value simultaneously due to similar market factors",
            "The risk of misunderstanding market data"
          ],
          correctAnswer: 2,
          explanation: "Correlation risk refers to the danger of having multiple positions that could all lose value at the same time because they respond similarly to market events or factors."
        }
      ]
    }
  ],
  pro: [
    {
      id: "module1",
      title: "Algorithmic Trading Basics",
      description: "Introduction to automated trading strategies and systems.",
      icon: "🤖",
      level: "pro",
      flashcards: [
        {
          id: "p1-card1",
          front: "What is algorithmic trading?",
          back: "Algorithmic trading uses computer programs and systems to execute trades based on predefined criteria such as price, timing, volume, or mathematical models."
        },
        {
          id: "p1-card2",
          front: "What is backtesting?",
          back: "Backtesting is the process of testing a trading strategy on historical data to evaluate its performance before risking real capital."
        },
        {
          id: "p1-card3",
          front: "What is high-frequency trading (HFT)?",
          back: "High-frequency trading is a form of algorithmic trading characterized by high-speed execution, high turnover rates, and high order-to-trade ratios. HFT firms may execute thousands or millions of trades per day."
        }
      ],
      quiz: [
        {
          id: "p1-q1",
          question: "What is a key advantage of algorithmic trading over manual trading?",
          options: [
            "Algos can predict market movements with 100% accuracy",
            "Execution of trades is faster and more consistent than human traders",
            "Algorithmic trading is risk-free",
            "Algorithmic trading always outperforms the market"
          ],
          correctAnswer: 1,
          explanation: "Algorithmic trading allows for faster and more consistent execution of trades without emotional biases, though it cannot predict markets with perfect accuracy nor is it risk-free."
        },
        {
          id: "p1-q2",
          question: "Which of these is NOT an important consideration when backtesting a strategy?",
          options: [
            "Transaction costs and slippage",
            "Market conditions and regime changes",
            "Look-ahead bias and overfitting",
            "The color scheme of your trading platform"
          ],
          correctAnswer: 3,
          explanation: "While transaction costs, market conditions, and avoiding biases are critical in backtesting, the color scheme of your trading platform has no impact on strategy performance evaluation."
        },
        {
          id: "p1-q3",
          question: "What is 'slippage' in algorithmic trading?",
          options: [
            "When a trading algorithm makes coding errors",
            "The difference between the expected price of a trade and the actual executed price",
            "When market data feeds disconnect temporarily",
            "The time delay between strategy signal and trade execution"
          ],
          correctAnswer: 1,
          explanation: "Slippage refers to the difference between the expected price of a trade and the price at which the trade is actually executed, often due to market volatility or low liquidity."
        }
      ]
    },
    {
      id: "module2",
      title: "Machine Learning in Trading",
      description: "Explore how AI and machine learning are revolutionizing trading.",
      icon: "🧠",
      level: "pro",
      flashcards: [
        {
          id: "p2-card1",
          front: "What is supervised learning in trading?",
          back: "Supervised learning algorithms are trained on labeled historical data to predict outcomes such as price movements, market regimes, or optimal entry/exit points."
        },
        {
          id: "p2-card2",
          front: "What is feature engineering?",
          back: "Feature engineering is the process of creating new input variables for machine learning models from existing data. In trading, this might include technical indicators, price patterns, or fundamental data transformations."
        },
        {
          id: "p2-card3",
          front: "What is overfitting in machine learning models?",
          back: "Overfitting occurs when a model learns the detail and noise in the training data too well, performing well on training data but poorly on new, unseen data. This is particularly dangerous in trading where market conditions constantly change."
        }
      ],
      quiz: [
        {
          id: "p2-q1",
          question: "Which technique helps prevent overfitting in machine learning models?",
          options: [
            "Using more complex models with more parameters",
            "Cross-validation and regularization",
            "Training on a very small dataset",
            "Maximizing the training accuracy at all costs"
          ],
          correctAnswer: 1,
          explanation: "Cross-validation (testing on different data subsets) and regularization techniques help prevent models from overfitting to training data and generalize better to new data."
        },
        {
          id: "p2-q2",
          question: "What type of machine learning is reinforcement learning?",
          options: [
            "Learning from labeled examples",
            "Learning by grouping similar data points",
            "Learning through trial and error interactions with an environment",
            "Learning by reducing dimensionality of data"
          ],
          correctAnswer: 2,
          explanation: "Reinforcement learning involves an agent learning optimal actions through trial and error interactions with an environment, receiving rewards or penalties based on its actions."
        },
        {
          id: "p2-q3",
          question: "Which is NOT a common application of machine learning in trading?",
          options: [
            "Market regime classification",
            "Sentiment analysis of news",
            "Guaranteed prediction of exact future prices",
            "Portfolio optimization"
          ],
          correctAnswer: 2,
          explanation: "While ML is used for regime classification, sentiment analysis and portfolio optimization, it cannot guarantee exact future price predictions with certainty, as markets are complex adaptive systems."
        }
      ]
    },
    {
      id: "module3",
      title: "Options Trading Strategies",
      description: "Advanced options strategies for sophisticated traders.",
      icon: "🎯",
      level: "pro",
      flashcards: [
        {
          id: "p3-card1",
          front: "What are the Greeks in options trading?",
          back: "The Greeks are risk measures that describe how option prices are expected to change with fluctuations in the underlying variables. The main Greeks are Delta, Gamma, Theta, Vega, and Rho."
        },
        {
          id: "p3-card2",
          front: "What is implied volatility?",
          back: "Implied volatility is the market's forecast of a likely movement in a security's price, derived from option prices. It represents the expected volatility of the underlying asset during the life of the option."
        },
        {
          id: "p3-card3",
          front: "What is a vertical spread?",
          back: "A vertical spread involves simultaneously buying and selling options of the same type (calls or puts) and expiration date but with different strike prices. It limits both potential profit and loss."
        }
      ],
      quiz: [
        {
          id: "p3-q1",
          question: "What does Delta measure in options?",
          options: [
            "The option's time decay rate",
            "The change in option price for a $1 change in underlying asset price",
            "The sensitivity to interest rate changes",
            "The rate of change of implied volatility"
          ],
          correctAnswer: 1,
          explanation: "Delta measures how much an option's price is expected to change for every $1 change in the price of the underlying asset, all else being equal."
        },
        {
          id: "p3-q2",
          question: "Which options strategy is created by buying a call and a put with the same strike price and expiration?",
          options: [
            "Straddle",
            "Strangle",
            "Iron Condor",
            "Butterfly Spread"
          ],
          correctAnswer: 0,
          explanation: "A straddle involves buying both a call and a put with the same strike price and expiration date. It profits from significant price movements in either direction."
        },
        {
          id: "p3-q3",
          question: "Which Greek measures an option's sensitivity to the passage of time?",
          options: [
            "Delta",
            "Gamma",
            "Theta",
            "Vega"
          ],
          correctAnswer: 2,
          explanation: "Theta measures the rate at which an option loses value as time passes, also known as time decay."
        }
      ]
    }
  ]
};
