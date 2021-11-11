const User = require("../models/User");

async function findOne(name){
  try{
    const user = await User.find({user_name: name});
    return user;
  } catch(err){
    return false;
  }
}

async function addOne(name){
  const user = new User({user_name: name});
  try {
      await user.save();
      return user;
  } catch(err) {
      return false;
  }
}

module.exports = Object.freeze({
  findOne,
  addOne
});