import * as Types from '../../__generated__/globalTypes';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { UserLayout_CurrentUserFragmentDoc, UserLayout_UserFragmentDoc } from '../../ui/__generated__/UserLayout.graphql';
import { Post_PostFragmentDoc } from '../../ui/__generated__/Post.graphql';
import { PostComment_PostFragmentDoc } from '../../ui/__generated__/GqlPostComment.graphql';
export type UserHistoryRouteQueryVariables = Types.Exact<{
  username: Types.Scalars['String'];
}>;


export type UserHistoryRouteQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', name: string | null } | null, user: { __typename?: 'User', id: string, name: string | null, joinedAt: any | null, isCurrentUser: boolean, recordCount: number | null, postCount: number | null, posts: { __typename?: 'PostConnection', hasMore: boolean, nodes: Array<{ __typename?: 'Post', id: string, statusType: Types.StatusType | null, status: string | null, comment: string | null, updatedAt: any | null, containsSpoiler: boolean | null, user: { __typename?: 'User', name: string | null } | null, record: { __typename?: 'Record', title: string | null } | null }> } } | null };

export type UserHistoryRoute_MorePostsQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID'];
  beforeId: Types.InputMaybe<Types.Scalars['ID']>;
}>;


export type UserHistoryRoute_MorePostsQuery = { __typename?: 'Query', user: { __typename?: 'User', posts: { __typename?: 'PostConnection', hasMore: boolean, nodes: Array<{ __typename?: 'Post', id: string, statusType: Types.StatusType | null, status: string | null, comment: string | null, updatedAt: any | null, containsSpoiler: boolean | null, user: { __typename?: 'User', name: string | null } | null, record: { __typename?: 'Record', title: string | null } | null }> } } | null };

export type UserHistoryRoute_PostConnectionFragment = { __typename?: 'PostConnection', hasMore: boolean, nodes: Array<{ __typename?: 'Post', id: string, statusType: Types.StatusType | null, status: string | null, comment: string | null, updatedAt: any | null, containsSpoiler: boolean | null, user: { __typename?: 'User', name: string | null } | null, record: { __typename?: 'Record', title: string | null } | null }> };

export const UserHistoryRoute_PostConnectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserHistoryRoute_postConnection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PostConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Post_post"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]} as unknown as DocumentNode<UserHistoryRoute_PostConnectionFragment, unknown>;
export const UserHistoryRouteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserHistoryRoute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserLayout_currentUser"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"userByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserLayout_user"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"IntValue","value":"32"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserHistoryRoute_postConnection"}}]}}]}}]}},...UserLayout_CurrentUserFragmentDoc.definitions,...UserLayout_UserFragmentDoc.definitions,...UserHistoryRoute_PostConnectionFragmentDoc.definitions,...Post_PostFragmentDoc.definitions,...PostComment_PostFragmentDoc.definitions]} as unknown as DocumentNode<UserHistoryRouteQuery, UserHistoryRouteQueryVariables>;
export const UserHistoryRoute_MorePostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserHistoryRoute_morePosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"beforeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"beforeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"beforeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"IntValue","value":"32"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserHistoryRoute_postConnection"}}]}}]}}]}},...UserHistoryRoute_PostConnectionFragmentDoc.definitions,...Post_PostFragmentDoc.definitions,...PostComment_PostFragmentDoc.definitions]} as unknown as DocumentNode<UserHistoryRoute_MorePostsQuery, UserHistoryRoute_MorePostsQueryVariables>;