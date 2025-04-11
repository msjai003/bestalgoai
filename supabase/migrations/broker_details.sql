
-- Create a storage bucket for broker images
INSERT INTO storage.buckets (id, name, public)
VALUES ('broker-images', 'Broker Images', true)
ON CONFLICT (id) DO NOTHING;

-- Add access policy for the broker-images bucket (public read)
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Public Read Access',
  '(bucket_id = ''broker-images''::text)',
  'broker-images'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Create a function to get broker image
CREATE OR REPLACE FUNCTION public.get_broker_image(p_broker_id INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT logo_image
    FROM public.broker_infocap
    WHERE broker_id = p_broker_id
    LIMIT 1
  );
END;
$$;
