import React, { useState, useEffect } from 'react';

function CategoriesAPI() {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch('http://localhost:5000/api/category', {
        credentials: 'include',
      });
      const data = await res.json();
      setCategories(data.categories);
    };

    getCategories();
  }, [callback]);
  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
}

export default CategoriesAPI;
