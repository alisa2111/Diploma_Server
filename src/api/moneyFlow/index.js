import {Router} from 'express'
import {schema} from '../account/model'
import {middleware as body} from 'bodymen'
import {addExpense, getAllExpenses, addIncome, getTotalIncome} from './controller'
export MoneyFlow, { schema } from './model'

const router = new Router()
const {key, value, comment} = schema.tree

/**
 * @api {post} money-flow/expenses/update update Expenses
 * when user add expense -> recalculating total expenses for pie chart
 */
// [TODO] Replace expenses with expense
router.post('/expenses/add',
  body({ key, value, comment }),
  addExpense)

/**
 * @api {get} /expenses/accountId Get all expenses
 */
router.get('/expenses/:id',
  getAllExpenses)

/**
 * @api {post} money-flow/expenses/update update Expenses
 * when user add expense -> recalculating total expenses for pie chart
 */
router.post('/income/add',
  body({ key, value, comment }),
  addIncome)

/**
 * @api {get} /income/accountId Get total account income
 */
router.get('/income/:id',
  getTotalIncome)

export default router
