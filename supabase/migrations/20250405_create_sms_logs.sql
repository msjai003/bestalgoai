
-- Create a table for SMS logs
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  mobile_number TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Only allow the authenticated user to see their own SMS logs
CREATE POLICY "Users can view their own SMS logs" 
  ON public.sms_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only the service role can insert SMS logs
CREATE POLICY "Service role can insert SMS logs" 
  ON public.sms_logs 
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
