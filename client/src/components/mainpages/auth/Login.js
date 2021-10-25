import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.status === 400) {
        alert(data.msg);
      } else {
        localStorage.setItem('firstLogin', true);
        window.location.assign('/');
      }
    } catch (err) {
      // alert(err.response.data.msg);
      alert(err.message);
    }
  };
  return (
    <div className='login-page'>
      <form onSubmit={loginSubmit}>
        <h2>Login</h2>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={user.email}
          onChange={onChangeInput}
        />

        <input
          type='password'
          name='password'
          required
          placeholder='Password'
          autoComplete='on'
          value={user.password}
          onChange={onChangeInput}
        />

        <div className='row'>
          <button type='submit'>Login</button>
          <Link to='/register'>Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
