-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  url_path TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create an index on email for faster lookups (unique constraint already creates one, but being explicit)
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (sign up)
CREATE POLICY "Allow public inserts"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow reading count but not individual emails
-- We'll handle count in the application layer, so we don't need a SELECT policy
-- This prevents anyone from reading the email list
CREATE POLICY "Deny public selects"
  ON waitlist
  FOR SELECT
  TO anon
  USING (false);

-- Create a function to get the count (this bypasses RLS)
CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER -- This runs with the permissions of the function creator, bypassing RLS
AS $$
  SELECT COUNT(*)::INTEGER FROM waitlist;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION get_waitlist_count() TO anon;

-- Create a function to validate and insert email
CREATE OR REPLACE FUNCTION add_to_waitlist(user_email TEXT, url_path TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  clean_email TEXT;
  result JSON;
BEGIN
  -- Normalize email: trim whitespace and convert to lowercase
  clean_email := LOWER(TRIM(user_email));

  -- Basic email validation
  IF clean_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid email format');
  END IF;

  -- Try to insert
  BEGIN
    INSERT INTO waitlist (email, url_path) VALUES (clean_email, url_path);
    RETURN json_build_object('success', true, 'message', 'Successfully added to waitlist');
  EXCEPTION WHEN unique_violation THEN
    -- Gracefully accept duplicate emails without revealing they exist
    RETURN json_build_object('success', true, 'message', 'Successfully added to waitlist');
  END;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION add_to_waitlist(TEXT) TO anon;
