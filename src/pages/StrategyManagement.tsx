
const handleToggleLiveMode = (id: number | string) => {
  const strategy = wishlistedStrategies.find(s => s.id === id);
  if (!strategy) return;
  
  const isPremium = typeof id === 'number' && id > 1;
  if (isPremium && !hasPremium && !strategy.isPaid) {
    sessionStorage.setItem('selectedStrategyId', id.toString());
    sessionStorage.setItem('redirectAfterPayment', '/pricing');
    navigate('/pricing');
    return;
  }
  
  setCurrentStrategyId(typeof id === 'string' ? parseInt(id, 10) : id);
  setTargetMode(strategy.isLive ? "paper" : "live");
  setConfirmationOpen(true);
};
