import React from 'react';
import { GqlUser as User, Stackable, StackablePropsData } from '../layouts';
import AddRecordDialog from '../ui/AddRecordDialog';
import { trackEvent } from '../Tracking';
import * as Mutations from '../Mutations';
import { RouteComponentProps, RouteHandler } from '../routes';
import { AddRecordRouteDocument, AddRecord_CreateRecordDocument, AddRecord_CreateRecordMutation } from './__generated__/AddRecord.graphql';
import { UserLayoutPropsData } from '../ui/GqlUserLayout';

type AddRecordRouteData = StackablePropsData & UserLayoutPropsData & {
  title?: string;
  referrer: string;
};

class AddRecord extends React.Component<RouteComponentProps<AddRecordRouteData>> {
  render() {
    return (
      <AddRecordDialog
        initialTitle={this.props.data.title}
        onCancel={this._returnToUser}
        onCreate={this._onCreate}
        createRecordMutation={AddRecord_CreateRecordDocument}
      />
    );
  }

  _onCreate = (result: AddRecord_CreateRecordMutation['createRecord']) => {
    trackEvent({
      eventCategory: 'Record',
      eventAction: 'Create',
      eventLabel: this.props.data.referrer,
    });
    Mutations.records.next({
      id: result.record.id,
      userId: result.record.user!.id,
      workId: result.record.work!.id,
    });
    this._returnToUser();
  };

  _returnToUser = () => {
    const basePath = `/users/${encodeURIComponent(this.props.data.currentUser!.name!)}/`;
    this.props.controller!.load({ path: basePath, query: {} }, { stacked: false, returnToParent: true });
  };
}

const routeHandler: RouteHandler<AddRecordRouteData> = {
  component: Stackable(User, AddRecord),

  async load({ loader, params, query, stacked }) {
    const {currentUser, ...data} = await loader.graphql(AddRecordRouteDocument);
    // TODO: redirect to login page
    if (!currentUser) {
      throw new Error('Login required.');
    }
    return {
      ...data,
      currentUser,
      user: currentUser, // for layout
      stacked, // for layout
      title: params.title,
      referrer: query.ref || 'AddRecord',
    };
  },

  renderTitle({ currentUser }) {
    return `${currentUser!.name} 사용자`;
  },
};
export default routeHandler;
