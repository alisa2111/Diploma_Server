import {MoneyFlow} from './index'
import { success, notFound } from '../../services/response/'
import _ from 'lodash'

/* EXPENSE */

// body: {expense: {key, title, value, comment}}
export const addExpense = ({body}, res, next) => {
  const newExpense = {...body.expense, type: 'expense'}
  MoneyFlow.create(newExpense)
    .then(expense => expense.view(true))
    .then(expense => getAllExpenses({params: {id: expense.accountId}}, res, next)
    )
    // [TODO] change status code
    .catch(() => res.status(409).end())
}

// params: {id: accountId}
export const getAllExpenses = ({params}, res, next) => {
  MoneyFlow.find({ accountId: params.id, type: 'expense' })
    .then(notFound(res))
    .then(accountExpenses => getSummaryExpenses(accountExpenses))
    .then(success(res, 201)) // res = total expenses
    .catch(next)
}

// [TODO] REFACTOR OR CHANGE LOGIC
export const getSummaryExpenses = (allExpenses) => {
  // HOME
  // [TODO] filter by date and type
  const homeExpenses = _.filter(allExpenses, expense => expense.key === 'home')
  let totalHomeExpense = 0
  _.forEach(homeExpenses, expense => {
    totalHomeExpense = totalHomeExpense + expense.value
    return totalHomeExpense
  })

  // SHOPPING
  const shoppingExpenses = _.filter(allExpenses, expense => expense.key === 'shopping')
  let totalShoppingExpense = 0
  _.forEach(shoppingExpenses, expense => {
    totalShoppingExpense = totalShoppingExpense + expense.value
    return totalShoppingExpense
  })

  // FOOD
  const foodExpenses = _.filter(allExpenses, expense => expense.key === 'food')
  let totalFoodExpense = 0
  _.forEach(foodExpenses, expense => {
    totalFoodExpense = totalFoodExpense + expense.value
    return totalFoodExpense
  })

  return [
    {
      key: 'home',
      value: totalHomeExpense,
      color: '#ba0979'
    },
    {
      key: 'food',
      value: totalFoodExpense,
      color: '#7009ba'
    },
    {
      key: 'shopping',
      value: totalShoppingExpense,
      color: '#1ba30f'
    }
  ]
}

/* INCOME */

// body: {income: {key, title, value, comment}}
export const addIncome = ({body}, res, next) => {
  //  const newIncome = {...body.income, type: 'income'}
  const newIncome = {...body, type: 'income'}
  console.log(newIncome)
  MoneyFlow.create(newIncome)
    .then(income => income.view(true))
    .then(income => getTotalIncome({params: {id: income.accountId}}, res, next)
    )
    // [TODO] change status code
    .catch(() => res.status(409).end())
}

// params: {id: accountId}
export const getTotalIncome = ({params}, res, next) => {
  MoneyFlow.find({ accountId: params.id, type: 'income' })
    .then(notFound(res))
    .then(accountIncome => getSummaryIncome(accountIncome))
    .then(success(res, 201)) // res = total income
    .catch(next)
}

// [TODO] REFACTOR OR CHANGE LOGIC
export const getSummaryIncome = (allIncome) => {
  const cash = _.filter(allIncome, income => income.key === 'cash')
  let totalCash = 0
  _.forEach(cash, income => {
    totalCash = totalCash + income.value
    return totalCash
  })

  const card = _.filter(allIncome, income => income.key === 'card')
  let totalCard = 0
  _.forEach(card, income => {
    totalCard = totalCard + income.value
    return totalCard
  })

  return [
    {
      key: 'cash',
      value: totalCash
    },
    {
      key: 'card',
      value: totalCard
    }
  ]
}
