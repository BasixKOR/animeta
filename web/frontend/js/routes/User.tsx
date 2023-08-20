import { RouteComponentProps, RouteHandler } from '../routes';
import React from 'react';
import { User as UserLayout } from '../layouts';
import Library from '../ui/Library';
import { UserRouteDocument, UserRouteQuery } from './__generated__/User.graphql';
import { NormalizedUserRouteQuery, normalizeUserRouteQuery } from '../UserRouteUtils';
import { UserLayoutPropsData } from '../ui/UserLayout';

type UserRouteData = UserLayoutPropsData & UserRouteQuery & {
  query: NormalizedUserRouteQuery;
};

function User({ data, controller }: RouteComponentProps<UserRouteData>) {
  const { query, user } = data;

  function addRecord() {
    const basePath = `/users/${encodeURIComponent(user.name!)}/`;
    controller!.load({ path: basePath, query: {} });
  }

  return (
    <Library
      query={query}
      onAddRecord={addRecord}
      user={user}
    />
  );
}

const routeHandler: RouteHandler<UserRouteData> = {
  component: UserLayout(User),

  async load({ loader, params, query }) {
    const { username } = params;
    const normalizedQuery = normalizeUserRouteQuery(query);
    const data = await loader.graphql(UserRouteDocument, {
      username,
      statusTypeFilter: normalizedQuery.statusType,
      categoryIdFilter: normalizedQuery.categoryId,
      recordOrder: normalizedQuery.orderBy,
    });
    const user = data.user;
    if (!user) {
      // TODO: 404
    }
    return {
      ...data,
      user: user!,
      query: normalizedQuery,
    };
  },

  renderTitle({ user }) {
    return `${user.name!} 사용자`;
  },
};
export default routeHandler;
