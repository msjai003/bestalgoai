
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
