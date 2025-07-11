import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id} style={{ marginBottom: '1rem' }}>
              <Link to={`/post/${post._id}`} style={{ fontWeight: 'bold' }}>{post.title}</Link>
              <div style={{ fontSize: '0.9em', color: '#555' }}>
                by {post.author?.username || 'Unknown'} in {post.category?.name || 'Uncategorized'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home; 