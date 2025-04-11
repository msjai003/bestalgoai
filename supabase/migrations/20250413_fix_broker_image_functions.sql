
-- Create a trigger for broker_profile_images to update the timestamp
CREATE OR REPLACE FUNCTION public.broker_profile_image_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the function
CREATE TRIGGER broker_profile_image_updated_at_trigger
BEFORE UPDATE ON public.broker_profile_images
FOR EACH ROW EXECUTE FUNCTION public.broker_profile_image_updated_at();

-- Create a function to get a broker profile image
CREATE OR REPLACE FUNCTION public.get_broker_profile_image(p_broker_id INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT image_url
    FROM public.broker_profile_images
    WHERE broker_id = p_broker_id AND is_active = true
    ORDER BY updated_at DESC
    LIMIT 1
  );
END;
$$;

-- Create a function to save a broker profile image
CREATE OR REPLACE FUNCTION public.save_broker_profile_image(p_broker_id INTEGER, p_image_url TEXT)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Mark any existing images for this broker as inactive
  UPDATE public.broker_profile_images
  SET is_active = false,
      updated_at = now()
  WHERE broker_id = p_broker_id AND is_active = true;
  
  -- Insert a new image record
  INSERT INTO public.broker_profile_images (
    broker_id,
    image_url,
    is_active
  ) VALUES (
    p_broker_id,
    p_image_url,
    true
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- Upsert broker image function (for backward compatibility)
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
