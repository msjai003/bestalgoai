
-- Create helper functions for database access
CREATE OR REPLACE FUNCTION public.get_all_tables()
RETURNS TABLE(name text, schema text, row_count bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tables.table_name::text AS name,
    tables.table_schema::text AS schema,
    (SELECT reltuples::bigint FROM pg_class WHERE oid = (tables.table_schema || '.' || tables.table_name)::regclass) AS row_count
  FROM
    information_schema.tables tables
  WHERE
    tables.table_schema = 'public'
    AND tables.table_type = 'BASE TABLE'
  ORDER BY
    tables.table_name;
END;
$$;

-- Function to get row count for a table
CREATE OR REPLACE FUNCTION public.get_row_count(table_name text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  result integer;
  query text;
BEGIN
  query := 'SELECT COUNT(*) FROM public.' || quote_ident(table_name);
  EXECUTE query INTO result;
  RETURN result;
EXCEPTION
  WHEN undefined_table THEN
    RETURN 0;
  WHEN others THEN
    RAISE EXCEPTION 'Error counting rows: %', SQLERRM;
END;
$$;

-- Function to check if a table exists and is accessible
CREATE OR REPLACE FUNCTION public.check_table_access(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  query text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = check_table_access.table_name
  ) THEN
    RETURN jsonb_build_object('exists', false, 'message', 'Table does not exist');
  END IF;

  query := 'WITH sample AS (SELECT * FROM public.' || quote_ident(table_name) || ' LIMIT 5) 
            SELECT jsonb_build_object(''exists'', true, ''count'', (SELECT COUNT(*) FROM public.' || 
            quote_ident(table_name) || '), ''sample'', (SELECT COALESCE(jsonb_agg(sample), ''[]''::jsonb) FROM sample))';
  
  EXECUTE query INTO result;
  RETURN result;
EXCEPTION
  WHEN others THEN
    RETURN jsonb_build_object('exists', false, 'error', SQLERRM);
END;
$$;

-- Function to execute a sample query on a table
CREATE OR REPLACE FUNCTION public.sample_query(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  query text;
BEGIN
  query := 'SELECT COALESCE(jsonb_agg(t), ''[]''::jsonb) FROM (SELECT * FROM public.' || 
           quote_ident(table_name) || ' LIMIT 10) t';
  
  EXECUTE query INTO result;
  RETURN result;
EXCEPTION
  WHEN others THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Function to add sample data (as a placeholder for the actual implementation)
CREATE OR REPLACE FUNCTION public.add_sample_data(
  sample_name text,
  sample_email text,
  sample_message text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a placeholder - in a real implementation, we would insert into the actual table
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Sample data added successfully',
    'data', jsonb_build_object(
      'name', sample_name,
      'email', sample_email,
      'message', sample_message
    )
  );
EXCEPTION
  WHEN others THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Function to get latest records (as a placeholder)
CREATE OR REPLACE FUNCTION public.get_latest_records(limit_count integer DEFAULT 5)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a placeholder - in a real implementation, we would query the actual table
  RETURN jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'name', 'Sample User 1',
      'created_at', now()
    ),
    jsonb_build_object(
      'id', 2,
      'name', 'Sample User 2',
      'created_at', now() - interval '1 day'
    )
  );
EXCEPTION
  WHEN others THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;
