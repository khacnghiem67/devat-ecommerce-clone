import React, { useState, useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';
import { useHistory, useParams } from 'react-router-dom';

const initialState = {
  product_id: '',
  title: '',
  price: 0,
  description:
    ' Lorem Ipsum has been the industry"s standard dummy text ever since the 1500s',
  content:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
  category: '',
  _id: '',
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const styleUpload = {
    display: images ? 'block' : 'none',
  };

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const params = useParams();

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;
  useEffect(() => {
    if (params.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [params.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('You"re not an admin');
      const file = e.target.files[0];

      if (!file) return alert('File not exist');

      if (file.size > 1024 * 1024) {
        //1mb
        return alert('Size too large');
      }

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return alert('File format is incorrect');
      }

      let formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: token,
        },
        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      setImages(data);
      console.log(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDistroy = async () => {
    try {
      if (!isAdmin) return alert('You are not admin');
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/destroy', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ public_id: images.public_id }),
      });
      const data = await res.json();

      setImages(false);
      setLoading(false);
      alert(data.msg);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('You are not admin');
      if (!images) return alert('No Image Upload');

      if (onEdit) {
        const res = await fetch(
          'http://localhost:5000/api/products/' + product._id,
          {
            method: 'PUT',
            credentials: 'include',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...product, images }),
          }
        );
        const data = await res.json();
      } else {
        const res = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...product, images }),
        });
        const data = await res.json();
      }

      setCallback(!callback);

      history.push('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='create_product'>
      <div className='upload'>
        <input type='file' name='file' id='file_up' onChange={handleUpload} />
        {loading ? (
          <div id='file_img'>
            <Loading />
          </div>
        ) : (
          <div id='file_img' style={styleUpload}>
            <img src={images ? images.url : ''} alt='' />
            <span onClick={handleDistroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label htmlFor='product_id'>Product ID</label>
          <input
            type='text'
            name='product_id'
            id='product_id'
            value={product.product_id}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>

        <div className='row'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            id='title'
            value={product.title}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            name='price'
            id='price'
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='description'>Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={product.description}
            rows='5'
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='content'>Content</label>
          <textarea
            type='text'
            name='content'
            id='content'
            value={product.content}
            rows='7'
            onChange={handleChangeInput}
          />
        </div>
        <div className='row'>
          <label htmlFor='categories'>Categories: </label>
          <select
            name='category'
            id='categories'
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value=''>Please select a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type='submit'>{onEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
