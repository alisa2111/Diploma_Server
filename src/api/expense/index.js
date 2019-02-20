import {Router} from "express";
import {schema} from "../account/model";
import {middleware as body} from "bodymen";
import {createExpense, getExpenses} from "./controller";
export Expense, { schema } from './model'

const router = new Router();
const {key, value, comment} = schema.tree;


/**
 * @api {post} /expenses/update update Expenses
 * when user add expense -> recalculating total expenses for pie chart
 */
router.post('/update',
  body({ key, value, comment }),
  createExpense);

/**
 * @api {get} /expenses/fetch Get Expenses
 */
router.get('/:id',
  getExpenses);

export default router;
