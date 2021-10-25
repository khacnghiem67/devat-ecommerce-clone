import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/user/register', {
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
      <form onSubmit={registerSubmit}>
        <h2>Register</h2>

        <input
          type='text'
          name='name'
          placeholder='Name'
          value={user.name}
          onChange={onChangeInput}
        />
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
          <button type='submit'>Register</button>
          <Link to='/login'>Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
