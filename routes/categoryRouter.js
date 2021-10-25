import express from 'express';
import categoryCtrl from '../controllers/categoryCtrl.js';
import { authAdmin } from '../middleware/authAdmin.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router
  .route('/category')
  .get(categoryCtrl.getCategories)
  .post(auth, authAdmin, categoryCtrl.createCategory);

router
  .route('/category/:id')
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  .put(auth, authAdmin, categoryCtrl.updateCategory);

export default router;
