const { buildSchema } = require("graphql");
module.exports = buildSchema(`

type Post {
    _id:ID!
    title:String!
    content:String!
    imageUrl:String!
    creator:User!
    createdAt:String!
    updatedAt:String!
}

type User {
    _id:ID!
    name:String!
    email:String!
    password:String
    status:String!
    posts:[Post!]!
}


input UserInputData {
    email:String!
    name:String!
    password:String!
}
type PostData{
    posts:[Post!]!
    totalPosts:Int!
}

input PostInputData {
    imageUrl:String!
    title:String!
    content:String!
}

type DeleteResponse {
    success: Boolean!
    message: String
    deletedPostId: ID
  }
type RootMutation {
    createUser(userInput:UserInputData):User!
    createPost(postInput:PostInputData):Post!
    updatePost(id:ID!,postInput:PostInputData):Post!
    deletePost(postId:ID!):DeleteResponse
}

type AuthData{
    token:String!
    userId:String!
}

type RootQuery{
    login(email:String!,password:String!):AuthData!
    posts(page:Int):PostData!
    post(postId:String!):Post!
}


schema {
    query:RootQuery
    mutation:RootMutation
}
`);
