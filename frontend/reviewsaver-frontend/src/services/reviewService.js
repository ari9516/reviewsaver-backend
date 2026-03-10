const API_BASE_URL = 'http://10.132.112.209:8080/api';

const reviewService = {
  // Get paginated reviews
  getReviews: async (page = 0, size = 10, category = null) => {
    let url = `${API_BASE_URL}/reviews/paged?page=${page}&size=${size}`;
    if (category && category !== 'all') {
      url = `${API_BASE_URL}/reviews/category/${category}/paged?page=${page}&size=${size}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },

  // Login
  login: async (email, deviceHash) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, deviceHash })
    });
    return response.json();
  },

  // Upvote/Downvote
  upvote: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/upvote`, { method: 'PUT' });
    return response.json();
  },
  downvote: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/downvote`, { method: 'PUT' });
    return response.json();
  },

  // Get single review
  getReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
    return response.json();
  }
};

export default reviewService;