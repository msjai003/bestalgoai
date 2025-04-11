
-- Create a function to update broker_image_url in broker_infocap
CREATE OR REPLACE FUNCTION public.upsert_broker_image(p_broker_id INTEGER, p_image_url TEXT)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_id INTEGER;
BEGIN
  -- Find if there's a record with this broker_id
  SELECT id INTO v_id 
  FROM public.broker_infocap 
  WHERE broker_id = p_broker_id 
  LIMIT 1;
  
  -- If record exists, update it
  IF v_id IS NOT NULL THEN
    UPDATE public.broker_infocap
    SET broker_image_url = p_image_url,
        updated_at = now()
    WHERE broker_id = p_broker_id;
    
    RETURN v_id;
  ELSE
    -- For cases where the record doesn't exist, 
    -- we'll just return null (this shouldn't generally happen)
    RETURN NULL;
  END IF;
END;
$$;

-- Create a function to get broker_image_url from broker_infocap
CREATE OR REPLACE FUNCTION public.get_broker_image(p_broker_id INTEGER)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT broker_image_url
    FROM public.broker_infocap
    WHERE broker_id = p_broker_id
    LIMIT 1
  );
END;
$$;
