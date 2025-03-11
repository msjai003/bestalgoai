
import os
import json
from supabase import create_client, Client

# Supabase project URL and anon key (same as in your frontend application)
url = "https://fzvrozrjtvflksumiqsk.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI"

# Initialize the Supabase client
supabase: Client = create_client(url, key)

def test_connection():
    """Test the connection to Supabase."""
    try:
        response = supabase.table('signup').select('id').limit(1).execute()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

def store_signup_data(email, password):
    """Store signup data in the signup table."""
    try:
        # In a real application, you would hash the password before storing
        data = {
            'email': email,
            'password_hash': password  # Note: In production, always hash passwords
        }
        
        response = supabase.table('signup').insert(data).execute()
        
        if hasattr(response, 'error') and response.error:
            print(f"❌ Error storing signup data: {response.error}")
            return False
        
        print("✅ Signup data stored successfully")
        return True
    except Exception as e:
        print(f"❌ Error storing signup data: {str(e)}")
        return False

def get_all_signups():
    """Retrieve all signup data from the signup table."""
    try:
        response = supabase.table('signup').select('*').execute()
        
        if hasattr(response, 'error') and response.error:
            print(f"❌ Error retrieving signup data: {response.error}")
            return None
        
        print(f"✅ Retrieved {len(response.data)} signup records")
        return response.data
    except Exception as e:
        print(f"❌ Error retrieving signup data: {str(e)}")
        return None

# Example usage
if __name__ == "__main__":
    # Test the connection
    if test_connection():
        # Example: Store a signup
        # store_signup_data("test@example.com", "securepassword123")
        
        # Example: Retrieve all signups
        signups = get_all_signups()
        if signups:
            print("\nSignup Records:")
            for signup in signups:
                print(f"ID: {signup.get('id')} | Email: {signup.get('email')}")
    else:
        print("Please check your Supabase credentials and network connection.")

# Instructions for use:
# 1. Install the Supabase Python client with: pip install supabase
# 2. Run this script with: python supabase_connector.py
# 3. Uncomment the example usage lines to test storing and retrieving data
