import {MoneyFlow} from './moneyFlowController'
import {success, notFound} from '../../services/response';
import {Source} from '../source/sourceController' // TODO remove
import {getSources, updateSource} from "../source/sourceService";

/**
 * body: {expense: {accountId, amount, categoryId, comment, sourceId}}
 */
export const addExpense = ({body}, res, next) => {
  const newExpense = {...body.expense, type: 'expense'};
  MoneyFlow.create(newExpense)
    .then(expense => expense.view(true))
    .then(expense => {
      updateSource(expense);
      return expense;
    })
    .then(expense => getSummaryExpenses({params: {accountId: expense.accountId}}, res, next))
    .catch(() => res.status(400).end())
};

/**
 * params: {accountId: accountId}
 */
export const getSummaryExpenses = ({params}, res, next) => {
  // TODO DATE
  MoneyFlow.aggregate(
    [
      {
        $match: {type: "expense"}},
      {
        $group: {
          _id: {type: "expense", categoryId: "$categoryId", accountId: params.accountId},
          totalAmount: {$sum: '$amount'}
        }
      },

      {
        $lookup:
          {
            from: "categories",
            localField: "_id.categoryId",
            foreignField: "_id",
            as: "category"
          }
      }

    ]
  )
    .then(notFound(res))
    .then(groupedData => groupedData.map(data => ({
        categoryId: data.category[0]._id,
        totalAmount: data.totalAmount,
        title: data.category[0].title,
        color: data.category[0].color,
        iconKey: data.category[0].iconKey
      })
    ))
    .then(success(res))
    .catch(next)
};

/**
 * body {income: accountId, amount, categoryId, comment, sourceId}
 */
export const addIncome = ({body}, res, next) => {
  const newIncome = {...body.income, type: 'income'};
  MoneyFlow.create(newIncome)
    .then(income => income.view(true))
    .then(income => updateSource(income))
    .then(() => getSources({params: {accountId: newIncome.accountId}}, res, next))
    .catch(() => res.status(400).end())
};

/**
 * params  {accountId: accountId}
 */

export const getAll = ({params}, res, next) => {
  MoneyFlow.find({accountId: params.accountId})
    .then(notFound(res))
    .then(success(res))
    .catch(() => res.status(400).end())
};

