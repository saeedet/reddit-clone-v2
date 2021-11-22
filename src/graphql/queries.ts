/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      type
      id
      title
      contents
      image
      createdAt
      updatedAt
      owner
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
          post {
            type
            id
            title
            contents
            image
            createdAt
            updatedAt
            owner
          }
          owner
        }
        nextToken
      }
      votes {
        items {
          id
          vote
          postID
          createdAt
          updatedAt
          post {
            type
            id
            title
            contents
            image
            createdAt
            updatedAt
            owner
          }
          owner
        }
        nextToken
      }
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        type
        id
        title
        contents
        image
        createdAt
        updatedAt
        owner
        comments {
          items {
            id
            postID
            content
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        votes {
          items {
            id
            vote
            postID
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const postsByDate = /* GraphQL */ `
  query PostsByDate(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        type
        id
        title
        contents
        image
        createdAt
        updatedAt
        owner
        comments {
          items {
            id
            postID
            content
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        votes {
          items {
            id
            vote
            postID
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      postID
      content
      createdAt
      updatedAt
      post {
        type
        id
        title
        contents
        image
        createdAt
        updatedAt
        owner
        comments {
          items {
            id
            postID
            content
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        votes {
          items {
            id
            vote
            postID
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }
      owner
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        content
        createdAt
        updatedAt
        post {
          type
          id
          title
          contents
          image
          createdAt
          updatedAt
          owner
          comments {
            nextToken
          }
          votes {
            nextToken
          }
        }
        owner
      }
      nextToken
    }
  }
`;
export const getVote = /* GraphQL */ `
  query GetVote($id: ID!) {
    getVote(id: $id) {
      id
      vote
      postID
      createdAt
      updatedAt
      post {
        type
        id
        title
        contents
        image
        createdAt
        updatedAt
        owner
        comments {
          items {
            id
            postID
            content
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        votes {
          items {
            id
            vote
            postID
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }
      owner
    }
  }
`;
export const listVotes = /* GraphQL */ `
  query ListVotes(
    $filter: ModelVoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        vote
        postID
        createdAt
        updatedAt
        post {
          type
          id
          title
          contents
          image
          createdAt
          updatedAt
          owner
          comments {
            nextToken
          }
          votes {
            nextToken
          }
        }
        owner
      }
      nextToken
    }
  }
`;
