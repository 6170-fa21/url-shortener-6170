const Short = require('../models/Short');
const User = require('../models/User');

async function getAll(){
  try{
    const shorts = await Short.aggregate([
      {$lookup:
        {
          from: 'users',
          localField: 'short_creator_id',
          foreignField: '_id',
          as: 'shortwithusers'
        }
      }
    ]);
    return shorts;
  } catch(err) {
    return false;
  }
}

async function findOne(name){
  try{
    const short = await Short.findOne({short_name: name}); //We make sure that names are unique
    return short;
  } catch(err) {
    return false;
  }
}

async function addOne(url, name, author) {
  try {
    const short = new Short({
      short_original_url: url,
      short_name: name
    });
    if (author !== undefined){
      const user = await User.findOne({user_name: author});
      if (user){
        const user_id = user._id;
        short.short_creator_id = user_id;
      }
    }
    await short.save();
    return short;
  } catch(err) {
    return false;
  }     
} 

async function updateOne(new_url, name){
  try{
    const short = await Short.findOne({short_name: name});
    short.short_original_url = new_url;
    await short.save();
    return short;
  } catch(err) {
    return false;
  }
}

async function incrementOne(name){
  try{
    const short = await Short.findOne({short_name: name});
    short.short_visit_count++;
    await short.save();
    return short;
  } catch(err) {
    return false;
  }
}

//add deleteOne
async function deleteOne(name){
  try{
    const short = await Short.deleteOne({short_name: name});
    return short;
  } catch(err) {
    return false;
  }
}

module.exports = Object.freeze({
  getAll,
  findOne,
  addOne,
  updateOne,
  incrementOne,
  deleteOne
});