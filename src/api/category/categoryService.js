import {success, notFound} from '../../services/response';
import {Category} from './categoryController'

/**
 * params: {accountId: accountId}
 * @return account's categories
 */
export const getAllCategories = ({params}, res, next, successCode = 200) => {
  Category.find({accountId: params.accountId})
    .then(notFound(res))
    .then(res => res.map(r => r.view()))
    .then(success(res, successCode))
    .catch(next)
};

/**
 * body: {category: {accountId, color, title, iconKey}}
 * @return created category
 */
export const createCategory = ({body}, res, next) => {
  Category.create(body.category)
    .then(category => category.view(true))
    .then(category => getAllCategories({params: {accountId: category.accountId}}, res, next, 201))
    .catch(next);
};

/**
 * params: {categoryId: categoryId}
 * body: {category: fields for updating}
 * @return updated category
 */
export const updateCategory = ({params, body}, res, next) => {
  Category.findById(params.categoryId)
    .then(notFound(res))
    .then(category => Object.assign(category, body.category).save())
    .then(category => category.view(true))
    .then(category => getAllCategories({params: {accountId: category.accountId}}, res, next, 202))
    .catch(next)
};

/**
 * params: {categoryId: categoryId}
 */
export const deleteCategory = ({params}, res, next) => {
  Category.findById(params.categoryId)
    .then(notFound(res))
    .then(category => category.remove())
    .then(category => getAllCategories({params: {accountId: category.accountId}}, res, next, 202))
    .catch(next)
};

