import {Router} from 'express'
import {schema} from '../account/model'
import {middleware as body} from 'bodymen'
import {addExpense, getAllExpenses, addIncome} from './moneyFlowService'
export MoneyFlow, { schema } from './model'

const router = new Router();
const {key, value, comment} = schema.tree;

/**
 * Add Expense
 * @api {post} money-flow/expenses/add
 * when user add expense -> recalculating total expenses for pie chart
 */
router.post('/expenses/add',
  addExpense);

/**
 * Get all expenses
 * @api {get} money-flow/expenses/accountId
 */
router.get('/expenses/:accountId',
  getAllExpenses);

/**
 * Add Income
 * @api {post} money-flow/income/add
 * @return updated sources for account
 */
router.post('/income/add',
  body({ key, value, comment }),
  addIncome);

export default router
