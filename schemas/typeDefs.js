const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    isVerified: Boolean!
  }

  type AuthCode {
    token: String
    user: User
    success: Boolean!
    message: String!
  }

  type Query {
    _empty: String
  }

  type CreateUserResponse {
    user: User
    success: Boolean!
    message: String!
  }

  type Mutation {
    registerUser(
      name: String!
      email: String!
      phone: String!
    ): CreateUserResponse!

    verifyCode(
      userId: ID!
      code: String!
    ): AuthCode!

    login(
      email: String!
    ): AuthCode!
  }
`;

module.exports = typeDefs;
