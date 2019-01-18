import {middleware as body} from "bodymen";
import { schema } from './model'
import {create} from "./controller";
import { Router } from 'express'
export Account, { schema } from './model'


const router = new Router();
const { balance, users } = schema.tree;

/**
 * @api {post} /accounts Create account
 */
router.post('/',
  body({ balance, users }),
  create);

export default router;
