import {createCategory, getAllCategories, updateCategory, deleteCategory} from "./categoryService";
import {Router} from "express";
export Category, { schema } from './model'

const router = new Router();

/**
 * Get all categories
 * @api {get} /categories/accountId
 */
router.get('/:accountId', getAllCategories);

/**
 * Create category
 * @api {post} /categories
 */
router.post('/', createCategory);

/**
 * Update category
 * @api {put} /categories/categoryId
 */
router.put('/:categoryId', updateCategory);

/**
 * Delete category
 * @api {delete} /categories/categoryId
 */
router.delete('/:categoryId', deleteCategory);

export default router;
