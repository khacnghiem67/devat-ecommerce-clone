import React, { useEffect, useState, useContext } from 'react';

import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import Filters from './Filters';
import LoadMore from './LoadMore';
function Products() {
  const state = useContext(GlobalState);

  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);

  const [isCheck, setIsCheck] = useState(false);

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      await fetch('http://localhost:5000/api/destroy', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ public_id }),
      });
      await fetch('http://localhost:5000/api/products/' + id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <>
      <Filters />
      {isAdmin && (
        <div className='delete-all'>
          <span>Select all</span>
          <input type='checkbox' checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className='products'>
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>

      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
}

export default Products;
