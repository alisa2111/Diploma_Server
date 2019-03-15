import {Category} from './categoryController'
import {MoneyFlow} from '../moneyFlow/moneyFlowController';

export const createCategory = (category) => {
  return new Promise((resolve, reject) => {
    Category.create(category)
      .then(category => resolve(category.view()))
      .catch(() => reject(500));
  });
};

export const getAllCategories = (accountId) => {
  return new Promise((resolve, reject) => {
    Category.find({accountId: accountId})
      .then(categories => resolve(categories.map(c => c.view())))
      .catch(reject);
  });
};

export const updateCategory = (ctgr) => {
  return new Promise((resolve, reject) => {
    Category.findById(ctgr.id)
      .then(category => {
        if (category) {
          return category;
        } else {
          reject(404);
        }
      })
      .then(category => Object.assign(category, ctgr).save())
      .then(category => category.view())
      .then(category => resolve(category))
      .catch(reject)
  });
};

export const deleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    Category.findOneAndRemove({_id: categoryId})
      .then(res => {
        if (res) {
          resolve(res);
        } else {
          reject(404);
        }
      })
      .catch(reject)
  });
};

//todo: move it to moneyFlowService.js
export const isCategoryConnectedToMoneyFlows = (categoryId) => {
  return new Promise((resolve, reject) => {
    MoneyFlow.findOne({categoryId: categoryId})
      .then(mf => resolve({result: !!mf}))
      .catch(reject)
  });
};

//todo: move it to moneyFlowService.js
export const replaceCategory = (categoryId, replaceTo) => {
  return new Promise((resolve, reject) => {
    MoneyFlow.updateMany(
      {categoryId: categoryId},
      {$set: {categoryId: replaceTo}}
    ).then(res => {
      if (res.ok) {
        resolve();
      } else {
        reject();
      }
    })
  });
};
