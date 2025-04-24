
-- Create a function to handle Google users specifically
CREATE OR REPLACE FUNCTION public.handle_google_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if this is a Google login (check provider in identities)
  IF EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = NEW.id AND provider = 'google'
  ) THEN
    -- Insert or update Google user details
    INSERT INTO public.google_user_details (
      id,
      email,
      google_id,
      picture_url,
      given_name,
      family_name,
      locale,
      verified_email
    )
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'sub',
      NEW.raw_user_meta_data->>'picture',
      NEW.raw_user_meta_data->>'given_name',
      NEW.raw_user_meta_data->>'family_name',
      NEW.raw_user_meta_data->>'locale',
      (NEW.raw_user_meta_data->>'email_verified')::boolean
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      email = EXCLUDED.email,
      google_id = EXCLUDED.google_id,
      picture_url = EXCLUDED.picture_url,
      given_name = EXCLUDED.given_name,
      family_name = EXCLUDED.family_name,
      locale = EXCLUDED.locale,
      verified_email = EXCLUDED.verified_email,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is created or updated
DROP TRIGGER IF EXISTS on_auth_google_user_created ON auth.users;
CREATE TRIGGER on_auth_google_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_google_user();

-- Ensure we have the google_user_details table
CREATE TABLE IF NOT EXISTS public.google_user_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  google_id TEXT,
  picture_url TEXT,
  given_name TEXT,
  family_name TEXT,
  locale TEXT,
  verified_email BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the google_user_details table
ALTER TABLE public.google_user_details ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own details
CREATE POLICY "Users can view their own Google details"
  ON public.google_user_details
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own details
CREATE POLICY "Users can update their own Google details"
  ON public.google_user_details
  FOR UPDATE
  USING (auth.uid() = id);
