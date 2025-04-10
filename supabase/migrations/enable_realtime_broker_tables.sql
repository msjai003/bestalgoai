
-- Enable replica identity for broker tables to track changes
ALTER TABLE public.broker_details REPLICA IDENTITY FULL;
ALTER TABLE public.brokers_admin REPLICA IDENTITY FULL;
ALTER TABLE public.broker_functionality REPLICA IDENTITY FULL;

-- Add the tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.broker_details;
ALTER PUBLICATION supabase_realtime ADD TABLE public.brokers_admin;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broker_functionality;

-- Create a function to ensure when broker name changes in brokers_admin,
-- it is propagated to broker_functionality table
CREATE OR REPLACE FUNCTION public.update_broker_functionality_name()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update broker_name in broker_functionality when it changes in brokers_admin
  UPDATE public.broker_functionality
  SET broker_name = NEW.broker_name, updated_at = now()
  WHERE broker_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create a trigger to automatically update broker_name in broker_functionality
CREATE TRIGGER update_broker_functionality_name_trigger
AFTER UPDATE OF broker_name ON public.brokers_admin
FOR EACH ROW
EXECUTE FUNCTION public.update_broker_functionality_name();
