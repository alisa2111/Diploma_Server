import {middleware as body} from "bodymen";
import { schema } from './model'
import { Router } from 'express'
import {createAccount} from "./controller";
export Account, { schema } from './model'


const router = new Router();
const { balance, users } = schema.tree;

/**
 * @api {post} /accounts Create account
 */
router.post('/',
  body({ balance, users }),
  createAccount);

export default router;
