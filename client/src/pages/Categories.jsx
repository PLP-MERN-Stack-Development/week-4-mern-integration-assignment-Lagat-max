import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await createCategory(name, token);
      setSuccess('Category created!');
      setName('');
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setError(null);
    setSuccess(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateCategory(editingId, editingName, token);
      setSuccess('Category updated!');
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteCategory(id, token);
      setSuccess('Category deleted!');
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Categories</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>New Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
        <button type="submit" disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      <h2>All Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat._id} style={{ marginBottom: '0.5rem' }}>
            {editingId === cat._id ? (
              <form onSubmit={handleEditSubmit} style={{ display: 'inline' }}>
                <input
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  required
                  style={{ marginRight: '0.5rem' }}
                />
                <button type="submit" disabled={saving} style={{ marginRight: '0.5rem' }}>Save</button>
                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {cat.name}
                <button onClick={() => handleEdit(cat)} style={{ marginLeft: '1rem', marginRight: '0.5rem' }}>Edit</button>
                <button onClick={() => handleDelete(cat._id)} style={{ color: 'white', background: '#e74c3c' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories; 