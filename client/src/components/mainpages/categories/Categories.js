import React, { useState, useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

function Categories() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState('');
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState('');

  const createCategory = async (e) => {
    e.preventDefault();

    try {
      if (onEdit) {
        const res = await fetch('http://localhost:5000/api/category/' + id, {
          method: 'PUT',
          body: JSON.stringify({ name: category }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          credentials: 'include',
        });
        const data = await res.json();

        alert(data.msg);
      } else {
        const res = await fetch('http://localhost:5000/api/category', {
          method: 'POST',
          body: JSON.stringify({ name: category }),
          headers: { 'Content-Type': 'application/json', Authorization: token },
          credentials: 'include',
        });
        const data = await res.json();

        alert(data.msg);
      }
      setOnEdit(false);
      setCategory('');
      setCallback(!callback);
    } catch (err) {
      alert(err.message);
    }
  };

  const editCategory = async (id, name) => {
    setId(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch('http://localhost:5000/api/category/' + id, {
        method: 'DELETE',

        headers: {
          Authorization: token,
        },
        credentials: 'include',
      });
      const data = await res.json();

      alert(data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='categories'>
      <form onSubmit={createCategory}>
        <label htmlFor='category'>Category</label>
        <input
          type='text'
          name='category'
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type='submit'>{onEdit ? 'Update' : 'Create'}</button>
      </form>
      <div className='col'>
        {categories.map((category) => (
          <div className='row' key={category._id}>
            <p>{category.name}</p>
            <div>
              <button onClick={() => editCategory(category._id, category.name)}>
                Edit
              </button>
              <button onClick={() => deleteCategory(category._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
