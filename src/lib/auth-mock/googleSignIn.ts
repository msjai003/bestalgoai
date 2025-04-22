
/**
 * Mock Google sign in function.
 */
export const mockSignInWithGoogle = async () => {
  console.log('Mock Google sign in attempt');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate a mock Google email
  const randomId = Math.floor(Math.random() * 10000);
  const email = `google.user${randomId}@gmail.com`;

  // Create mock user
  const user = {
    id: `google_user_${Date.now()}`,
    email,
    full_name: `Google User ${randomId}`,
  };

  // Create mock profile
  const profile = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    mobile: null,
    trading_experience: 'beginner',
    is_research_analyst: false,
    certification_number: null,
  };

  // Store in localStorage
  localStorage.setItem('mock_auth_user', JSON.stringify(user));
  localStorage.setItem('mock_auth_profile', JSON.stringify(profile));

  console.log('Mock Google sign in successful:', user);

  return { data: { user }, error: null };
};
