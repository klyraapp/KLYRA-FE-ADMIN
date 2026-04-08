import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($userData: CreateUserDto!) {
    createUser(userData: $userData) {
      message
    }
  }
`;

export const GET_ALL_USER = gql`
  query findUsers {
    findUsers {
      name
      email
    }
  }
`;
