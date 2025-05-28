
export const getStrategyDetailsParams = (strategy: any) => {
  if (!strategy || !strategy.strategy_details) {
    console.log('No strategy or strategy_details found');
    return {
      instrumentSettings: [],
      timeSettings: [],
      executionSettings: [],
      other: []
    };
  }
  
  const strategyDetails = strategy.strategy_details;
  console.log('Processing strategy details for:', strategy.name, strategyDetails);
  
  const result = {
    instrumentSettings: [] as Array<{name: string, value: string}>,
    timeSettings: [] as Array<{name: string, value: string}>,
    executionSettings: [] as Array<{name: string, value: string}>,
    other: [] as Array<{name: string, value: string}>
  };
  
  // Define categories for organizing the data based on actual field names from database
  const instrumentKeys = [
    'Index', 'Segment', 'Underlying from', 'Position', 'Option Type',
    'index', 'segment', 'underlyingFrom', 'position', 'optionType',
    'instrumentSettings'
  ];
  
  const timeKeys = [
    'Entry Time', 'Exit Time', 'Expiry', 'No Re-entry After',
    'entryTime', 'exitTime', 'expiry', 'noReentryAfter',
    'entrySettings', 'timeSettings'
  ];
  
  const executionKeys = [
    'Square Off', 'Trail SL to Break-even price', 'Leg Selection',
    'Total Lot', 'Strike Criteria', 'Premium', 'Strategy Type',
    'squareOff', 'trailSLToBreakeven', 'legSelection', 'totalLot',
    'strikeCriteria', 'premium', 'strategyType', 'legwiseSettings',
    'legBuilder', 'executionSettings'
  ];
  
  // Process each key-value pair from strategy_details
  Object.entries(strategyDetails).forEach(([key, value]) => {
    // Skip the Legs array as it's handled separately
    if (key === 'Legs') {
      return;
    }
    
    // Handle nested objects (like instrumentSettings, entrySettings, etc.)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If it's a nested object, process its properties
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue === null || nestedValue === undefined) {
          return;
        }
        
        let stringValue = '';
        if (typeof nestedValue === 'boolean') {
          stringValue = nestedValue ? 'Yes' : 'No';
        } else if (typeof nestedValue === 'object' && nestedValue !== null) {
          // Type assertion for the object with enabled property
          const objWithEnabled = nestedValue as { enabled?: boolean; value?: any };
          if (objWithEnabled.enabled !== undefined) {
            stringValue = objWithEnabled.enabled ? (objWithEnabled.value?.toString() || 'On') : 'Off';
          } else {
            stringValue = JSON.stringify(nestedValue);
          }
        } else {
          stringValue = String(nestedValue);
        }
        
        // Skip empty or meaningless values
        if (!stringValue || stringValue === '' || stringValue === 'Not selected' || stringValue === 'null') {
          return;
        }
        
        // Categorize based on the parent key and nested key
        const displayName = `${key} - ${nestedKey}`;
        
        if (instrumentKeys.some(k => key.toLowerCase().includes(k.toLowerCase()) || nestedKey.toLowerCase().includes(k.toLowerCase()))) {
          result.instrumentSettings.push({ name: displayName, value: stringValue });
        } else if (timeKeys.some(k => key.toLowerCase().includes(k.toLowerCase()) || nestedKey.toLowerCase().includes(k.toLowerCase()))) {
          result.timeSettings.push({ name: displayName, value: stringValue });
        } else if (executionKeys.some(k => key.toLowerCase().includes(k.toLowerCase()) || nestedKey.toLowerCase().includes(k.toLowerCase()))) {
          result.executionSettings.push({ name: displayName, value: stringValue });
        } else {
          result.other.push({ name: displayName, value: stringValue });
        }
      });
      return;
    }
    
    // Handle primitive values
    let stringValue = '';
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    } else if (typeof value === 'boolean') {
      stringValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'object') {
      // Handle object values by extracting meaningful information
      const objWithEnabled = value as { enabled?: boolean; value?: any };
      if (objWithEnabled.enabled !== undefined) {
        stringValue = objWithEnabled.enabled ? (objWithEnabled.value?.toString() || 'On') : 'Off';
      } else {
        stringValue = JSON.stringify(value);
      }
    } else {
      stringValue = String(value);
    }
    
    // Skip empty strings, "Not selected", and other meaningless values
    if (!stringValue || stringValue === '' || stringValue === 'Not selected' || stringValue === 'null') {
      return;
    }
    
    if (instrumentKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      result.instrumentSettings.push({ name: key, value: stringValue });
    } else if (timeKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      result.timeSettings.push({ name: key, value: stringValue });
    } else if (executionKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      result.executionSettings.push({ name: key, value: stringValue });
    } else {
      result.other.push({ name: key, value: stringValue });
    }
  });
  
  console.log('Processed strategy details:', result);
  return result;
};

export const getStrategyLegs = (strategy: any) => {
  if (!strategy || !strategy.strategy_details || !strategy.strategy_details.Legs) {
    console.log('No legs found in strategy details');
    return [];
  }
  
  console.log('Strategy legs:', strategy.strategy_details.Legs);
  return strategy.strategy_details.Legs;
};
