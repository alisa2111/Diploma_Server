import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  replaceCategory,
  isCategoryConnectedToMoneyFlows
} from "./categoryService";
import {Router} from "express";
import {failRequest, success} from "../../services/response";

export Category, {schema} from './model'

const router = new Router();

/**
 * Get all categories
 *
 * @api {get} /categories/accountId
 * @params: {accountId: accountId}
 * @return account's categories
 */
router.get('/all/:accountId', ({params}, res) => returnAllCategories(params.accountId, res));

/**
 * Create category
 *
 * @api {post} /categories
 * @params {body: {category: {accountId, color, title, iconKey}}}
 * @return all categories with created one for specified account
 */
router.post('/', ({body}, res) => {
  createCategory(body.category)
    .then(category => returnAllCategories(category.accountId, res, 201))
    .catch(failRequest(res));
});

/**
 * Update category
 *
 * @api {put} /categories/categoryId
 * @params: {categoryId: categoryId}
 * @body: {category: fields for updating}
 * @return all categories with updated one for specified account
 */
router.put('/:categoryId', ({params, body}, res) => {
  updateCategory(body.category)
    .then(updatedCategory => returnAllCategories(updatedCategory.accountId, res, 202))
    .catch(failRequest(res));
});

/**
 * Delete category
 *
 * If replaceTo param exists, all moneyFlows with :categoryId
 * will be updated and get :replaceTo value for categoryId instead
 *
 * @api {post} /categories/delete/:categoryId
 * @params: {categoryId: categoryId}
 * @body: {replaceTo ?: replaceToId}
 * @returns all categories for deleted category's accountId
 */
router.post('/delete/:categoryId', ({params, body}, res) => {
  if (body.replaceTo) {
    replaceCategory(params.categoryId, body.replaceTo)
      .then(() => processDeleteCategory(params.categoryId, res, 202))
      .catch(failRequest(res))
  } else {
    processDeleteCategory(params.categoryId, res, 202)
  }
});

const processDeleteCategory = (categoryId, res, successStatus) =>
  deleteCategory(categoryId)
    .then(category => returnAllCategories(category.accountId, res, successStatus))
    .catch(failRequest(res));

const returnAllCategories = (accountId, res, successStatus) =>
  getAllCategories(accountId)
    .then(success(res, successStatus))
    .catch(failRequest(res));

/**
 *
 * @api {get} /categories/check/:categoryId
 * @params: {categoryId: categoryId}
 * @return: {result: resultValue (true | false)}
 */
router.get('/check/:categoryId', ({params}, res) => {
  isCategoryConnectedToMoneyFlows(params.categoryId)
    .then(success(res))
    .catch(failRequest(res));
});

export default router;
