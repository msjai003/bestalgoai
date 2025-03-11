
# Python Supabase Connector

This is a simple Python script to connect to your Supabase database and interact with the `signup` table.

## Setup

1. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

2. Run the script:
   ```
   python supabase_connector.py
   ```

## Usage

The script provides several functions:

- `test_connection()`: Tests the connection to your Supabase database
- `store_signup_data(email, password)`: Stores signup data in the signup table
- `get_all_signups()`: Retrieves all signup data from the signup table

You can uncomment the example usage lines in the script to test storing and retrieving data.

## Security Notice

This script includes your Supabase URL and anon key directly in the code. For a production application, you should:

1. Store these values in environment variables
2. NEVER store raw passwords in your database - always hash them
3. Consider using a more secure authentication method for your backend applications

## Integration with Web Application

This Python script can run alongside your web application to:

- Process data from your Supabase database
- Perform backend operations separate from your frontend
- Build data pipelines or analytics on your user data
