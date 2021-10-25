import { useEffect, useState } from 'react';

const baseURL = 'http://localhost:5000';

function ProductsAPI() {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);

  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(
        `http://localhost:5000/api/products?limit=${
          page * 9
        }&${category}&${sort}&title=[regex]=${search}`
      );
      const data = await res.json();
      setProducts(data.products);
      setResult(data.result);
    };
    getProducts();
  }, [callback, category, sort, search, page]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    result: [result, setResult],
    page: [page, setPage],
  };
}

export default ProductsAPI;
