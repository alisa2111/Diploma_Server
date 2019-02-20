import {Expense} from "./index";
import { success, notFound } from '../../services/response/';
import _ from 'lodash';

// body: {expense: {key, title, value, comment}}
export const createExpense = ({body}, res, next) => {
  Expense.create(body.expense)
    .then(expense => expense.view(true))
    .then(expense => getExpenses({params: {id: expense.accountId}}, res, next)
    )
    // [TODO] change status code
    .catch(() => res.status(409).end())
};

// params: {id: accountId}
export const getExpenses = ({params}, res, next) => {
  Expense.find({ accountId: params.id })
    .then(accountExpenses => getSummaryExpenses(accountExpenses))
    .then(success(res, 201)) // res = total expenses
    .catch(next)
};

// [TODO] REFACTOR OR CHANGE LOGIC
export const getSummaryExpenses = (allExpenses) => {

  // HOME
  // [TODO] filter by date
  const homeExpenses = _.filter(allExpenses, expense => expense.key === "home");
  let totalHomeExpense = 0;
  _.forEach(homeExpenses, expense => {
    totalHomeExpense = totalHomeExpense + expense.value;
    return totalHomeExpense;
  });

  // SHOPPING
  const shoppingExpenses = _.filter(allExpenses, expense => expense.key === "shopping");
  let totalShoppingExpense = 0;
  _.forEach(shoppingExpenses, expense => {
    totalShoppingExpense = totalShoppingExpense + expense.value;
    return totalShoppingExpense;
  });

  // FOOD
  const foodExpenses = _.filter(allExpenses, expense => expense.key === "food");
  let totalFoodExpense = 0;
  _.forEach(foodExpenses, expense => {
    totalFoodExpense = totalFoodExpense + expense.value;
    return totalFoodExpense;
  });

  return [
    {
      key: "home",
      value: totalHomeExpense,
      color: "#ba0979"
    },
    {
      key: "food",
      value: totalFoodExpense,
      color: "#7009ba"
    },
    {
      key: "shopping",
      value: totalShoppingExpense,
      color: "#1ba30f"
    }
  ]
};
