import API_BASE_URL from '../config';

const reviewService = {
  login: async (email, deviceHash) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, deviceHash })
    });
    return response.json();
  }
};

export default reviewService;