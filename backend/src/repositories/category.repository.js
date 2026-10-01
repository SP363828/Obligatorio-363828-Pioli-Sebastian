const Category = require('../models/category.model');

function findCategories(filter = {}, { skip = 0, limit = 10 } = {}) {
  return Category.find(filter).skip(skip).limit(limit);
}

function countCategories(filter = {}) {
  return Category.countDocuments(filter);
}

function findCategoryById(id) {
  return Category.findById(id);
}

function addCategory(data) {
  return Category.create(data);
}

function updateCategory(id, data) {
  return Category.findByIdAndUpdate(id, data, { new: true });
}

function removeCategory(id) {
  return Category.findByIdAndDelete(id);
}

module.exports = {
  findCategories,
  countCategories,
  findCategoryById,
  addCategory,
  updateCategory,
  removeCategory,
};