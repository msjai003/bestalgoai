
-- Enable replica identity for broker tables to track changes
ALTER TABLE public.broker_details REPLICA IDENTITY FULL;
ALTER TABLE public.brokers_admin REPLICA IDENTITY FULL;
ALTER TABLE public.broker_functionality REPLICA IDENTITY FULL;

-- Add the tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.broker_details;
ALTER PUBLICATION supabase_realtime ADD TABLE public.brokers_admin;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broker_functionality;
