const Resource = require('../models/resource.model');

function findResources(filter = {}, { skip = 0, limit = 10 } = {}) {
  return Resource.find(filter).skip(skip).limit(limit);
}

function countResources(filter = {}) {
  return Resource.countDocuments(filter);
}

function findResourceIdsByName(regex) {
  return Resource.find({ name: regex }).distinct('_id');
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
  findResourceIdsByName,
  findResourceById,
  findByCategoryId,
  addResource,
  updateResource,
  removeResource,
};