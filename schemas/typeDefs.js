const { gql } = require("apollo-server");

const typeDefs = gql`
  """Un usuario en el sistema"""
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    isVerified: Boolean!
  }

  """Respuesta genérica para envíos de código y verificaciones"""
  type VerificationResponse {
    success: Boolean!
    message: String!
  }

  """Respuesta al crear un usuario por WhatsApp"""
  type CreateUserResponse {
    user: User!                
    sent: Boolean!             
    to: String!               
    message: String          
  }

  type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  type Mutation {
    """Crea un usuario + dispara verificación por WhatsApp"""
    createUser(
      name: String!
      email: String!
      phone: String!
    ): CreateUserResponse!    

    """Actualiza datos de usuario; si cambia phone, fuerza re-verificación"""
    updateUser(
      id: ID!
      name: String
      email: String
      phone: String
    ): User!

    removeUser(id: ID!): User!
    sendWhatsappVerification(userId: ID!): VerificationResponse!
    verifyWhatsappCode(userId: ID!, code: String!): VerificationResponse!
  }
`;

module.exports = typeDefs;