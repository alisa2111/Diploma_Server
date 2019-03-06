import {middleware as body} from "bodymen";
import { schema } from './model'
import { Router } from 'express'
import {createAccount, getAccount} from "./accountService";
export Account, { schema } from './model'


const router = new Router();
const { balance, owner } = schema.tree;

/**
 * Create account
 * @api {post} /accounts
 */
router.post('/',
  body({ balance, owner }),
  createAccount);

/**
 * Get Account
 * @api {get} /accounts/:accountId
 */
router.get('/:accountId',
  getAccount);

export default router;
