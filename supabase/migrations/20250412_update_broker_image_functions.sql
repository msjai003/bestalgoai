
-- Create a function to update broker_image_url in broker_infocap
CREATE OR REPLACE FUNCTION public.update_broker_image_url(p_broker_id INTEGER, p_image_url TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.broker_infocap
  SET broker_image_url = p_image_url
  WHERE broker_id = p_broker_id;
END;
$$;
