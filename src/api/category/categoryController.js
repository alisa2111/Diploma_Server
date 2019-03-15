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
router.get('/:accountId', ({params}, res) => {
  getAllCategories(params.accountId)
    .then(success(res))
    .catch(failRequest(res));
});

/**
 * Create category
 *
 * @api {post} /categories
 * @params {body: {category: {accountId, color, title, iconKey}}}
 * @return all categories with created one for specified account
 */
router.post('/', ({body}, res) => {
  createCategory(body.category)
    .then(category =>
      getAllCategories(category.accountId)
        .then(success(res, 201))
        .catch(failRequest(res)))
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
    .then(updatedCategory =>
      getAllCategories(updatedCategory.accountId)
        .then(success(res, 202))
        .catch(failRequest(res)))
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
//todo: refactor it !!!
router.post('/delete/:categoryId', ({params, body}, res) => {
  if (body.replaceTo) {
    replaceCategory(params.categoryId, body.replaceTo)
      .then(() => deleteCategory(params.categoryId)
        .then(category =>
          getAllCategories(category.accountId)
            .then(success(res, 202))
            .catch(failRequest(res)))
        .catch(failRequest(res)))
  } else {
    deleteCategory(params.categoryId)
      .then(category =>
        getAllCategories(category.accountId)
          .then(success(res, 202))
          .catch(failRequest(res)))
      .catch(failRequest(res))
  }
});

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
