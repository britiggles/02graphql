const userModel = require('../models/userModel');

const resolvers = {
  Mutation: {
    registerUser: async (_, args) => {
      return await userModel.registerUser(args);
    },
    verifyCode: async (_, args) => {
      return await userModel.verifyCode(args);
    },
    login: async (_, args) => {
      return await userModel.login(args);
    }
  }
};

module.exports = resolvers;
