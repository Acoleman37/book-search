const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
    }
    type Query {
        me: User
    }
    type Book {
        bookId: String!
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }
    input bookId {
        description: String
        title: String
        bookId: String
        image: String
        link: String
        authors: [String]
    }
    type Auth {
        token: ID!
        user: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(savedBook: ID): User
        removeBook(bookId: ID): User
    }
`;

module.exports = typeDefs;