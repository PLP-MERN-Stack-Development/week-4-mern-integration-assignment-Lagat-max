import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategories, createPost, updatePost, getPostById } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateEditPost = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Fetch categories and post (if editing)
  useEffect(() => {
    async function fetchData() {
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (isEdit) {
          const post = await getPostById(id);
          setTitle(post.title);
          setContent(post.content);
          setCategory(post.category?._id || '');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const postData = { title, content, category };
      let post;
      if (isEdit) {
        post = await updatePost(id, postData, token);
      } else {
        post = await createPost(postData, token);
      }
      navigate(`/post/${post._id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Post' : 'Create Post'}</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={8}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Category:</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            style={{ width: '100%' }}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" disabled={saving} style={{ width: '100%' }}>
          {saving ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Post')}
        </button>
      </form>
    </div>
  );
};

export default CreateEditPost; 