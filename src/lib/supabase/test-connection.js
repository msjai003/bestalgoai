
const { createClient } = require('@supabase/supabase-js');

// Use the actual Supabase URL and anon key from your project
const supabaseUrl = "https://fzvrozrjtvflksumiqsk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI";

// Create a Supabase client with simple configuration
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // For testing, don't persist session
    autoRefreshToken: false
  }
});

// Function to test the connection by fetching user profiles
async function testConnection() {
  console.log("Testing Supabase connection...");
  
  try {
    // First try a simple health check to see if we can connect at all
    const { data: healthData, error: healthError } = await supabase.from('user_profiles').select('count');
    
    if (healthError) {
      console.error("Connection test failed:", healthError);
      return false;
    }
    
    console.log("Connection successful! Count:", healthData);
    
    // Now try to fetch actual profiles
    const { data, error } = await supabase.from('user_profiles').select('*');
    
    if (error) {
      console.error("Error fetching user profiles:", error);
      return false;
    }
    
    console.log("Successfully fetched profiles:", data);
    return true;
  } catch (error) {
    console.error("Exception during test:", error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log("Test completed:", success ? "SUCCESS" : "FAILED");
  });
