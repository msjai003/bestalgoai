
-- Create the broker_functionality table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.broker_functionality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id INTEGER NOT NULL,
  broker_name TEXT NOT NULL,
  function_name TEXT NOT NULL,
  function_description TEXT,
  function_slug TEXT NOT NULL,
  function_enabled BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  broker_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(broker_id, function_slug)
);

-- Enable row level security
ALTER TABLE public.broker_functionality ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view broker functionality
CREATE POLICY "Anyone can view broker functionality" 
ON public.broker_functionality FOR SELECT 
TO authenticated
USING (true);

-- Enable replica identity for realtime
ALTER TABLE public.broker_functionality REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.broker_functionality;

-- Create a table for broker function configs if it doesn't exist
CREATE TABLE IF NOT EXISTS public.brokers_function_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id INTEGER NOT NULL,
  function_slug TEXT NOT NULL,
  config_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(broker_id, function_slug)
);

-- Enable row level security
ALTER TABLE public.brokers_function_configs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view function configs
CREATE POLICY "Anyone can view broker function configs" 
ON public.brokers_function_configs FOR SELECT 
TO authenticated
USING (true);

-- Enable replica identity for realtime
ALTER TABLE public.brokers_function_configs REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.brokers_function_configs;
