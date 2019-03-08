import {Router} from 'express'
import {schema} from '../account/model'
import {middleware as body} from 'bodymen'
import {addExpense, getSummaryExpenses, addIncome} from './moneyFlowService'
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
 * Get summary expenses
 * @api {get} money-flow/expenses/summary/:accountId
 * @return array of summary expenses
 * @return_example [{
 *      categoryId: string
 *      totalAmount: number
 *      title: string
 *      color: string
 *      iconKey: string
 *  }]
 *
 */
router.get('/expenses/summary/:accountId',
  getSummaryExpenses);

/**
 * Add Income
 * @api {post} money-flow/income/add
 * @return updated sources for account
 */
router.post('/income/add',
  body({ key, value, comment }),
  addIncome);

export default router
