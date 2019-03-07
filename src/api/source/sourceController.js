import {Router} from "express";
import {createSource, getSources, updateSourceAmount} from "./sourceService";
import { schema } from './model';
export Source, { schema } from './model'

const router = new Router();

/**
 * Get all sources
 * @api {get} /sources/accountId
 */
router.get('/:accountId',
  getSources);

/**
 * Create source
 * @api {post} /sources
 */
router.post('/',
  createSource);

/**
 * Update source
 * @api {post} /sources
 */
router.post('/',
  updateSourceAmount);

export default router;
