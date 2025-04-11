
-- Create a storage bucket for broker images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('broker-logos', 'Broker Logos', true)
ON CONFLICT (id) DO NOTHING;

-- Add access policy for the broker-logos bucket (public read)
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Public Read Access for broker-logos',
  '(bucket_id = ''broker-logos''::text)',
  'broker-logos'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Add access policy for authenticated users to upload
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Authenticated users can upload to broker-logos',
  '(bucket_id = ''broker-logos''::text AND auth.role() = ''authenticated''::text)',
  'broker-logos'
)
ON CONFLICT (name, bucket_id) DO NOTHING;
