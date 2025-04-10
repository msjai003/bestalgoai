
-- Create a function to update broker_name in broker_functionality when it changes in broker_details
CREATE OR REPLACE FUNCTION public.update_broker_functionality_name()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update broker_name in broker_functionality when it changes in broker_details
  UPDATE public.broker_functionality
  SET broker_name = NEW.broker_name, updated_at = now()
  WHERE broker_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create a trigger to automatically update broker_name in broker_functionality
CREATE TRIGGER update_broker_functionality_name_trigger
AFTER UPDATE OF broker_name ON public.broker_details
FOR EACH ROW
EXECUTE FUNCTION public.update_broker_functionality_name();
