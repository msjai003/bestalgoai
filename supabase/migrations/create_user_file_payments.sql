
-- Create table for tracking user file payments
CREATE TABLE IF NOT EXISTS public.user_file_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  file_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  amount INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Create a unique constraint to prevent duplicate payments
  UNIQUE(user_id, file_id)
);

-- Add RLS policies
ALTER TABLE public.user_file_payments ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own payments
CREATE POLICY "Users can view their own payments" 
  ON public.user_file_payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own payments
CREATE POLICY "Users can create payment records" 
  ON public.user_file_payments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_user_file_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_file_payments_updated_at
BEFORE UPDATE ON public.user_file_payments
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_file_payments_updated_at();
