const Resource = require('../models/resource.model');

function findResources(filter = {}, { skip = 0, limit = 10 } = {}) {
  return Resource.find(filter).skip(skip).limit(limit);
}

function countResources(filter = {}) {
  return Resource.countDocuments(filter);
}

function findResourceById(id) {
  return Resource.findById(id);
}

function findByCategoryId(categoryId) {
  return Resource.find({ category: categoryId });
}

function addResource(data) {
  return Resource.create(data);
}

function updateResource(id, data) {
  return Resource.findByIdAndUpdate(id, data, { new: true });
}

function removeResource(id) {
  return Resource.findByIdAndDelete(id);
}

module.exports = {
  findResources,
  countResources,
  findResourceById,
  findByCategoryId,
  addResource,
  updateResource,
  removeResource,
};