
-- Create function to get all broker functions
CREATE OR REPLACE FUNCTION public.get_all_broker_functions()
RETURNS SETOF broker_functionality
LANGUAGE sql
AS $$
  SELECT * FROM public.broker_functionality 
  ORDER BY broker_id, function_name;
$$;

-- Create function to get functions for a specific broker
CREATE OR REPLACE FUNCTION public.get_broker_functions(p_broker_id INTEGER)
RETURNS SETOF broker_functionality
LANGUAGE sql
AS $$
  SELECT * FROM public.broker_functionality 
  WHERE broker_id = p_broker_id 
  AND function_enabled = true
  ORDER BY function_name;
$$;

-- Create function to check if a broker has a specific function
CREATE OR REPLACE FUNCTION public.has_broker_function(p_broker_id INTEGER, p_function_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.broker_functionality 
    WHERE broker_id = p_broker_id 
    AND function_slug = p_function_slug 
    AND function_enabled = true
  );
$$;

-- Create function to check if a broker function is premium
CREATE OR REPLACE FUNCTION public.is_broker_function_premium(p_broker_id INTEGER, p_function_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
  SELECT is_premium FROM public.broker_functionality 
  WHERE broker_id = p_broker_id 
  AND function_slug = p_function_slug 
  AND function_enabled = true
  LIMIT 1;
$$;

-- Create function to get broker function config
CREATE OR REPLACE FUNCTION public.get_broker_function_config(p_broker_id INTEGER, p_function_slug TEXT)
RETURNS JSONB
LANGUAGE sql
AS $$
  SELECT config_data FROM public.brokers_function_configs 
  WHERE broker_id = p_broker_id 
  AND function_slug = p_function_slug
  LIMIT 1;
$$;

-- Create function to save a broker function
CREATE OR REPLACE FUNCTION public.save_broker_function(
  p_broker_id INTEGER,
  p_broker_name TEXT,
  p_function_name TEXT,
  p_function_description TEXT,
  p_function_slug TEXT,
  p_function_enabled BOOLEAN,
  p_is_premium BOOLEAN,
  p_broker_image TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Check if the function already exists
  SELECT id INTO v_id 
  FROM public.broker_functionality 
  WHERE broker_id = p_broker_id 
  AND function_slug = p_function_slug;
  
  -- If it exists, update it
  IF v_id IS NOT NULL THEN
    UPDATE public.broker_functionality
    SET 
      broker_name = p_broker_name,
      function_name = p_function_name,
      function_description = p_function_description,
      function_enabled = p_function_enabled,
      is_premium = p_is_premium,
      broker_image = p_broker_image,
      updated_at = now()
    WHERE id = v_id;
    
    RETURN v_id::TEXT;
  -- Otherwise, insert a new record
  ELSE
    INSERT INTO public.broker_functionality (
      broker_id,
      broker_name,
      function_name,
      function_description,
      function_slug,
      function_enabled,
      is_premium,
      broker_image
    ) VALUES (
      p_broker_id,
      p_broker_name,
      p_function_name,
      p_function_description,
      p_function_slug,
      p_function_enabled,
      p_is_premium,
      p_broker_image
    )
    RETURNING id INTO v_id;
    
    RETURN v_id::TEXT;
  END IF;
END;
$$;
