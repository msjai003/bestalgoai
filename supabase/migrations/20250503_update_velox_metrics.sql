
-- Update Velox Edge metrics with the data from the provided image
UPDATE public.velox_edge_metrics
SET 
  overall_profit = 592758.75,
  overall_profit_percentage = 266.62,
  number_of_trades = 1295,
  win_percentage = 44.09,
  loss_percentage = 55.91,
  max_drawdown = -25942.50,
  max_drawdown_percentage = -11.67,
  avg_profit_per_trade = 457.73,
  avg_profit_per_trade_percentage = 0.21,
  max_profit_in_single_trade = 7323.75,
  max_profit_in_single_trade_percentage = 3.29,
  max_loss_in_single_trade = -4136.25,
  max_loss_in_single_trade_percentage = -1.86,
  avg_profit_on_winning_trades = 2853.84,
  avg_profit_on_winning_trades_percentage = 1.28,
  avg_loss_on_losing_trades = -1432.02,
  avg_loss_on_losing_trades_percentage = -0.64,
  reward_to_risk_ratio = 1.99,
  max_win_streak = 7,
  max_losing_streak = 10,
  return_max_dd = 4.36,
  drawdown_duration = '57 [7/29/2024 to 9/23/2024]',
  max_trades_in_drawdown = 70,
  expectancy_ratio = 0.32;
