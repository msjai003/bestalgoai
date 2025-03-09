
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Info', 'apikey']
}));

// Store Supabase configuration
const supabaseUrl = 'https://fzvrozrjtvflksumiqsk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dnJvenJqdHZmbGtzdW1pcXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjExOTAsImV4cCI6MjA1Njg5NzE5MH0.MSib8YmoljwsG2IgjoR5BB22d6UCSw3Qlag35QIu2kI';

// Generic proxy endpoint
app.all('/proxy/*', async (req, res) => {
  try {
    // Extract the path after /proxy/
    const path = req.url.replace('/proxy/', '');
    const fullUrl = `${supabaseUrl}/${path}`;
    
    console.log(`Proxying request to: ${fullUrl}`);
    
    // Forward headers except host
    const headers = { ...req.headers };
    delete headers.host;
    
    // Ensure apikey is present
    if (!headers.apikey) {
      headers.apikey = supabaseAnonKey;
    }
    
    // Make the request to Supabase
    const response = await axios({
      method: req.method,
      url: fullUrl,
      headers: headers,
      data: req.method !== 'GET' ? req.body : undefined,
      params: req.query
    });
    
    // Set response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Send the response
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
  console.log(`Test the server: http://localhost:${PORT}/test`);
  console.log(`Proxy URL format: http://localhost:${PORT}/proxy/rest/v1/your-endpoint`);
});
