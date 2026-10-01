const User = require('../models/user.model');

function findByUsernameOrEmail(username, email) {
  return User.findOne({ $or: [{ username }, { email }] });
}

function findByUsername(username) {
  return User.findOne({ username });
}

function findById(id) {
  return User.findById(id);
}

function addUser(data) {
  return User.create(data);
}

function updatePlan(id, plan) {
  return User.findByIdAndUpdate(id, { plan }, { new: true });
}

module.exports = {
  findByUsernameOrEmail,
  findByUsername,
  findById,
  addUser,
  updatePlan,
};
