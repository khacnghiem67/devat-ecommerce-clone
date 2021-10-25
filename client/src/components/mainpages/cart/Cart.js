import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import PaypalButton from './PaypalButton';

function Cart() {
  const state = useContext(GlobalState);

  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);

  const addToCart = async (cart) => {
    await fetch('http://localhost:5000/user/addcart', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ cart }),
    });
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity = item.quantity === 1 ? 1 : item.quantity - 1;
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm('Do you want to remove this product')) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addToCart(cart);
    }
  };

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };
    getTotal();
  }, [cart]);

  const tranSuccess = async (payment) => {
    console.log(payment);

    const { paymentID, address } = payment;

    await fetch('http://localhost:5000/api/payment', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ cart, paymentID, address }),
    });

    setCart([]);
    addToCart([]);
    alert('You have successfully placed an order');
  };

  if (cart.length === 0) {
    return (
      <h2 style={{ textAlign: 'center', fontSize: '5rem' }}>Cart Empty</h2>
    );
  }
  return (
    <div>
      {cart.map((product) => (
        <div className='detail cart' key={product._id}>
          <img src={product.images.url} alt='' />

          <div className='box-detail'>
            <h2>{product.title}</h2>

            <h3>$ {product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>
            {/* <p>Sold : {product.sold}</p> */}

            <div className='amount'>
              <button onClick={() => decrement(product._id)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}>+</button>
            </div>

            <div className='delete' onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}

      <div className='total'>
        <h3>Total : $ {total}</h3>
        <PaypalButton total={total} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
}

export default Cart;
