import React, { createContext, useState, useEffect } from 'react';
import ProductsAPI from './api/ProductsAPI';
import UserAPI from './api/UserAPI';
import CategoriesAPI from './api/CategoriesAPI';

export const GlobalState = createContext();

export const DataProvider = (props) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await fetch('http://localhost:5000/user/refresh_token', {
          credentials: 'include',
        });
        const data = await res.json();
        setToken(data.accesstoken);

        setTimeout(() => {
          refreshToken();
        }, [10 * 60 * 1000]);
      };
      refreshToken();
    }
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
  };
  return (
    <GlobalState.Provider value={state}>{props.children}</GlobalState.Provider>
  );
};
