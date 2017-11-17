const Op = require('sequelize').Op;
const errors = require('feathers-errors');

/**
 * Get Messages of a Conversation
 * @param  {Sequelize.Model} Model     Conversation Model
 * @param  {Number} cId       Conversation Id
 * @param  {Number} userId    Authenticated User ID
 * @param  {Number} ccId      Conversation creater Id
 * @param  {Number} partnerId Partner id of the Conversation
 * @return {Promise}          Collection of Messages belonging to the conversation
 */
module.exports = getMessages;

async function getMessages (Model, cId, userId, ccId, partnerId) {
  let result;
  let condition;
  let isConvUser = true;
  if (userId === ccId) {
    condition = {
      deletedBySender: null
    };
  } else if (userId === partnerId) {
    isConvUser = false
    condition = {
      deletedByReciever: null
    }
  } else {
    return null;
  }

  try {
    const params = {
      where: condition,
      raw: true
    }
    const conversation = await Model.findById(cId);
    if (conversation) {
      if (isConvUser && conversation.deletedByUser) {
        throw new errors.NotFound('This conversation is removed by user');
      } else if (!isConvUser && conversation.deletedByPartner) {
        throw new errors.NotFound('This conversation is removed by user');
      }
      result = await conversation.getMessages(params);
      return result;
    }
  } catch(e) {
    console.log(e);
    reject(e);
  }
};
