const { compare, hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { idArg, mutationType, stringArg } = require('nexus')
const { APP_SECRET, getUserId } = require('../utils')

const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg({ nullable: true }),
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        // TODO: handle your data with database, below is a mock data
        const user = {
          id: 1,
          name,
          email,
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (parent, { email, password }, context) => {
        // TODO: handle your data with database, below is a mock data
        const user = {
          id: 1,
          name: 'yugasun',
          email,
          password: await hash('graphql', 10),
        }
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg({ nullable: true }),
      },
      resolve: (parent, { title, content }, ctx) => {
        const userId = getUserId(ctx)
        // TODO: handle your data with database, below is a mock data
        return {
          id: 1,
          title,
          content,
          published: false,
          author: { connect: { id: Number(userId) } },
        }
      },
    })

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        // TODO: handle your data with database, below is a mock data
        return {
          id,
          message: 'Delete Success',
        }
      },
    })

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        // TODO: handle your data with database, below is a mock data
        return {
          post: {
            id: 1,
            title,
            content,
            published: true,
            author: { connect: { id: Number(userId) } },
          },
          message: 'Publish Success',
        }
      },
    })
  },
})

module.exports = {
  Mutation,
}
