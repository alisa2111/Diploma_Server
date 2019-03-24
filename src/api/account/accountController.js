import { schema } from './model'
import { invSchema } from '../../services/mailer/model'
import { Router } from 'express'
import {createAccount, getAccount, sendInvite} from "./accountService";
export Account, { schema } from './model'
export Invite, { invSchema } from '../../services/mailer/model'


const router = new Router();

/**
 * Create account
 * @api {post} /accounts
 */
router.post('/',
  createAccount);

/**
 * Get Account
 * @api {get} /accounts/:accountId
 */
router.get('/:accountId',
  getAccount);

/**
 * Invite user to account
 * @api {post} /accounts/invite
 */
router.post('/invite',
  sendInvite);


export default router;
