import {createCategory, getAllCategories} from "./categoryService";
import {Router} from "express";
export Category, { schema } from './model'

const router = new Router();

/**
 * Get all categories
 * @api {get} /categories/accountId
 */
router.get('/:accountId',
  getAllCategories);

/**
 * Create category
 * @api {post} /categories
 */
router.post('/',
  createCategory);

export default router;
