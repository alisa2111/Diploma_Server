import {Router} from 'express'
import {schema} from '../account/model'
import {middleware as body} from 'bodymen'
import {addExpense, getSummaryExpenses, addIncome, getAll} from './moneyFlowService'
export MoneyFlow, { schema } from './model'

const router = new Router();
const {key, value, comment} = schema.tree;

/**
 * Get all money-flow for history
 * @api {get} money-flow/:accountId
 * @return all account's money-flow
 */
router.get('/:accountId', getAll);


/**
 * Add Expense
 * @api {post} money-flow/expenses/add
 * when user add expense -> recalculating total expenses for pie chart
 */
router.post('/expenses',
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
router.post('/income',
  body({ key, value, comment }),
  addIncome);

export default router
