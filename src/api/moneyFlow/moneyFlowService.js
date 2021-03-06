import {MoneyFlow} from './moneyFlowController'
import {success, notFound, failRequest} from '../../services/response';
import {returnAllSources, Source} from '../source/sourceController' // TODO remove
import {updateSourceBalance} from "../source/sourceService";
import mongoose, { Schema } from 'mongoose'
import {getCtgrSummaryExpenses} from "../category/categoryService";
import _ from "lodash";

/**
 * body: {expense: {accountId, amount, categoryId, comment, sourceId}}
 */
export const addExpense = ({body}, res, next) => {
  const newExpense = {...body.expense, type: 'expense', date: new Date(body.expense.date)};
  newExpense.amount = Math.round(newExpense.amount * 100) / 100;
  MoneyFlow.create(newExpense)
    .then(expense => expense.view(true))
    .then(expense => {
      updateSourceBalance(expense);
      return expense;
    })
    .then(expense => getSummaryExpenses({params: {accountId: expense.accountId}}, res, next))
    .catch(() => res.status(400).end())
};

/**
 * params: {accountId: accountId}
 */
export const getSummaryExpenses = ({params}, res, next) => {
  getCtgrSummaryExpenses(params.accountId)
    .then(success(res))
    .catch(next)
};

/**
 * body {income: accountId, amount, categoryId, comment, sourceId}
 */
export const addIncome = ({body}, res) => {
  const newIncome = {...body.income, type: 'income', date: new Date(body.income.date)};
  newIncome.amount = Math.round(newIncome.amount * 100) / 100;
  MoneyFlow.create(newIncome)
    .then(income => income.view(true))
    .then(income => updateSourceBalance(income))
    .then(() => returnAllSources(newIncome.accountId, res, 201))
    .catch(failRequest(res));
};

/**
 * params  {accountId: accountId}
 */

export const getAll = ({params}, res) => {
  const match = {accountId: mongoose.Types.ObjectId(params.accountId)};
  getMoneyFlows(match, res);
};

/**
 * body {
 * filterableFields: {type, categoryId, sourceId, startDate, endDate},
 * accountId
 * }
 */
export const filterMoneyFlows = ({body}, res) => {
  let createdAt = {};
  let match = _.omitBy(body.filterableFields, value => value === "");
  match.accountId = mongoose.Types.ObjectId(body.accountId);

  if (match.categoryId) {
    match.categoryId =  mongoose.Types.ObjectId(match.categoryId)
  }

  if (match.sourceId) {
    match.sourceId =  mongoose.Types.ObjectId(match.sourceId)
  }

  if (match.startDate) {
    const start = new Date(match.startDate);
    match = _.omit(match, "startDate");
    match.createdAt = _.assign(createdAt, {"$gt": start})
  }

  if (match.endDate) {
    let end = new Date (match.endDate);
    end.setDate(end.getDate() + 1);
    match = _.omit(match, "endDate");
    match.createdAt = _.assign(createdAt, {"$lt": end});
  }
  getMoneyFlows (match, res);
};


const getMoneyFlows = (match, res) =>
  MoneyFlow.aggregate(
    [
      {
        $match: match
      },
      {
        $lookup:
          {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
      },

      {
        $lookup:
          {
            from: "sources",
            localField: "sourceId",
            foreignField: "_id",
            as: "source"
          }
      }
    ]
  )
    .then(notFound(res))
    .then(success(res))
    .catch(() => res.status(400).end());
