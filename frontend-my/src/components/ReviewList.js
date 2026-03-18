import React from 'react';

function ReviewList({ user }) {
  return (
    <div style={{padding: '20px'}}>
      <h2>Welcome {user?.email}!</h2>
      <p>This is where your reviews will appear.</p>
      <p>User ID: {user?.id}</p>
    </div>
  );
}

export default ReviewList;