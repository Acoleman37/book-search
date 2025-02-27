const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },

    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        // Add and remove books potential bugs
        saveBook: async (parent, { bookId }, context) => {

            // console.log("saveBook: " + token);
            if (context) {
                const updatedBookList = await User.findOneAndUpdate(
                    { _id: context.user},
                    { $push: { savedBooks: bookId } },
                    { new: true }
                );

                return updatedBookList;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { book }, context) => {
        
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    { _id: context.username },
                    { $pull: { savedBooks: book } },
                    { new: true}
                );

                return updatedBookList;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;