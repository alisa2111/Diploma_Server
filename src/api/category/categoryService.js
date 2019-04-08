import {Category} from './categoryController'
import {MoneyFlow} from '../moneyFlow/moneyFlowController';
import mongoose from "mongoose";

export const createCategory = (category) => {
  return new Promise((resolve, reject) => {
    Category.create(category)
      .then(category => resolve(category.view()))
      .catch(() => reject(500));
  });
};

export const createMultipleCategories = categories => Category.insertMany(categories);

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
    isCategoryConnectedToMoneyFlows(categoryId)
      .then(result => {
        if (result.connected) {
          reject(403);
        } else {
          Category.findOneAndRemove({_id: categoryId})
            .then(res => {
              if (res) {
                resolve(res);
              } else {
                reject(404);
              }
            })
            .catch(reject)
        }
      })
      .catch(reject);
  });
};

//todo: move it to moneyFlowService.js
export const isCategoryConnectedToMoneyFlows = (categoryId) => {
  return new Promise((resolve, reject) => {
    MoneyFlow.findOne({categoryId: categoryId})
      .then(mf => resolve({connected: !!mf}))
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

export const getCtgrSummaryExpenses = (accountId) => {
  //TODO: Date
  return new Promise((resolve, reject) => {
    Category.aggregate([
      {$match: {accountId: mongoose.Types.ObjectId(accountId)}},
      {
        $lookup:
          {
            from: "moneyflows",
            localField: "_id",
            foreignField: "categoryId",
            as: "moneyFlow"
          }
      },
      {
        $project: {
          title: 1,
          color: 1,
          iconKey: 1,
          moneyFlow: {
            $cond: {if: {$gt: [{$size: "$moneyFlow"}, 0]}, then: "$moneyFlow", else: [{type: 'expense', amount: 0}]}
          }
        }
      },
      {$unwind: "$moneyFlow"},
      {
        $group: {
          _id: {
            categoryId: "$_id", color: "$color", iconKey: "$iconKey", title: "$title"
          },
          totalAmount: {$sum: '$moneyFlow.amount'}
        }
      }
    ])
      .then(groupedData => resolve(groupedData.map(data => ({
          categoryId: data._id.categoryId,
          totalAmount: data.totalAmount,
          title: data._id.title,
          color: data._id.color,
          iconKey: data._id.iconKey
        })
      )))
      .catch(err => reject(500));
  });
};
