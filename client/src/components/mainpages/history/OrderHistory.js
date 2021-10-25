import React, { useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          // nếu là admin thì fetch tất cả payment của all user về
          const res = await fetch('http://localhost:5000/api/payment', {
            headers: {
              Authorization: token,
            },
            credentials: 'include',
          });
          const data = await res.json();

          if (res.status === 400 || res.status === 500) {
            alert(data.msg);
          } else {
            setHistory(data.payments);
          }
        } else {
          // nếu ko là admin thì fetch payment của chính user đó thôi

          const res = await fetch('http://localhost:5000/user/history', {
            headers: {
              Authorization: token,
            },
            credentials: 'include',
          });
          const data = await res.json();

          if (res.status === 400 || res.status === 500) {
            alert(data.msg);
          } else {
            setHistory(data.history);
          }
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);

  return (
    <div className='history-page'>
      <h2>History</h2>

      <h4>You have {history.length} ordered</h4>

      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date of Purchased</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {history.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/history/${items._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
