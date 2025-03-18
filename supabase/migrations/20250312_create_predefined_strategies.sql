
-- Create a table for predefined strategy customizations
CREATE TABLE IF NOT EXISTS public.predefined_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.predefined_strategies ENABLE ROW LEVEL SECURITY;

-- Create policy that allows only admins to select predefined strategies
CREATE POLICY "Admins can select predefined strategies" 
  ON public.predefined_strategies 
  FOR SELECT 
  USING (public.is_admin());

-- Create policy that allows only admins to insert predefined strategies
CREATE POLICY "Admins can insert predefined strategies" 
  ON public.predefined_strategies 
  FOR INSERT 
  WITH CHECK (public.is_admin());

-- Create policy that allows only admins to update predefined strategies
CREATE POLICY "Admins can update predefined strategies" 
  ON public.predefined_strategies 
  FOR UPDATE 
  USING (public.is_admin());

-- Create policy that allows only admins to delete predefined strategies
CREATE POLICY "Admins can delete predefined strategies" 
  ON public.predefined_strategies 
  FOR DELETE 
  USING (public.is_admin());

-- Add trigger for updating the updated_at timestamp
CREATE TRIGGER predefined_strategies_updated_at
  BEFORE UPDATE ON public.predefined_strategies
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
