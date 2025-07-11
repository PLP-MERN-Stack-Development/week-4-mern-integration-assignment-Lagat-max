import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    getPostById(id)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!post) return <p>Post not found.</p>;

  const isAuthor = user && post.author && user.id === post.author._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleteError(null);
    try {
      await deletePost(post._id, token);
      navigate('/');
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <div style={{ fontSize: '0.9em', color: '#555', marginBottom: '1rem' }}>
        by {post.author?.username || 'Unknown'} in {post.category?.name || 'Uncategorized'}
      </div>
      <div style={{ marginBottom: '2rem' }}>{post.content}</div>
      {isAuthor && (
        <>
          <button onClick={() => navigate(`/edit/${post._id}`)} style={{ marginBottom: '1rem', marginRight: '1rem' }}>
            Edit Post
          </button>
          <button onClick={handleDelete} style={{ marginBottom: '1rem', background: '#e74c3c', color: 'white' }}>
            Delete Post
          </button>
          {deleteError && <div style={{ color: 'red', marginBottom: '1rem' }}>{deleteError}</div>}
        </>
      )}
      <div>
        <Link to="/">&larr; Back to posts</Link>
      </div>
    </div>
  );
};

export default Post; 