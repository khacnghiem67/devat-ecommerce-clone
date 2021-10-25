import React, { useState, useEffect } from 'react';

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await fetch('http://localhost:5000/user/infor', {
            headers: {
              Authorization: token,
            },
            credentials: 'include',
          });
          const data = await res.json();

          if (res.status === 400 || res.status === 500) {
            alert(data.msg);
          } else {
            setIsLogged(true);
            data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
            setCart(data.cart);
          }
        } catch (err) {
          alert(err.message);
        }
      };

      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) return alert('Please login to countinue to buying');
    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await fetch('http://localhost:5000/user/addcart', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ cart: [...cart, { ...product, quantity: 1 }] }),
      });
    } else {
      alert('The product has been added to cart');
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart,
    history: [history, setHistory],
    callback: [callback, setCallback],
  };
}

export default UserAPI;
