import {Router} from 'express'
import {schema} from '../account/model'
import {middleware as body} from 'bodymen'
import {updateExpenses, getAllExpenses} from './controller'
export MoneyFlow, { schema } from './model'

const router = new Router()
const {key, value, comment} = schema.tree

/**
 * @api {post} money-flow/expenses/update update Expenses
 * when user add expense -> recalculating total expenses for pie chart
 */
router.post('/expenses/update',
  body({ key, value, comment }),
  updateExpenses)

/**
 * @api {get} /expenses/accountId Get all expenses
 */
router.get('/expenses/:id',
  getAllExpenses)

export default router
