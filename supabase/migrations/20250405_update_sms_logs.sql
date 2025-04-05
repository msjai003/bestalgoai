
-- Remove the previous "Authenticated users can insert SMS logs" policy
DROP POLICY IF EXISTS "Authenticated users can insert SMS logs" ON public.sms_logs;

-- Only allow the service role can insert SMS logs (for the edge function)
CREATE POLICY "Service role can insert SMS logs" 
  ON public.sms_logs 
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
