import express from 'express';
import paymentCtrl from '../controllers/paymentCtrl.js';
import { auth } from '../middleware/auth.js';
import { authAdmin } from '../middleware/authAdmin.js';
const router = express.Router();

router
  .route('/payment')
  .get(auth, authAdmin, paymentCtrl.getPayments)
  .post(auth, paymentCtrl.createPayment);

export default router;
