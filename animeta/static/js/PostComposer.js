var React = require('react/addons');
var StatusInput = require('./StatusInput');
var util = require('./util');

var PostComposer = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            statusType: this.props.initialStatusType,
            status: util.plusOne(this.props.currentStatus),
            comment: '',
            publishTwitter: localStorage.getItem('publishTwitter') === 'true'
        };
    },

    render() {
        var currentStatus;
        if (this.props.currentStatus) {
            currentStatus = <span className="progress-current">{this.props.currentStatus} &rarr; </span>;
        }
        return <form className="record-detail-update">
            <div className="progress">
                <select name="status_type"
                    valueLink={this.linkState('statusType')}>
                    <option value="watching">보는 중</option>
                    <option value="finished">완료</option>
                    <option value="suspended">중단</option>
                    <option value="interested">볼 예정</option>
                </select>
                {' @ '}
                {currentStatus}
                <StatusInput name="status"
                    value={this.state.status}
                    onChange={this._onStatusChange} />
            </div>
            <textarea name="comment" rows={3} cols={30} autoFocus
                valueLink={this.linkState('comment')} />
            <div className="actions">
                <label>
                    <input type="checkbox" name="publish_twitter"
                        checked={this._isTwitterConnected() && this.state.publishTwitter}
                        onChange={this._onPublishTwitterChange} />
                    {' 트위터에 공유'}
                </label>
                <button type="button" onClick={this._onSubmit}>기록 추가</button>
            </div>
        </form>;
    },

    _onSubmit(event) {
        event.preventDefault();
        localStorage.setItem('publishTwitter', this.state.publishTwitter);
        this.props.onSave({
            status: this.state.status,
            status_type: this.state.statusType,
            comment: this.state.comment,
            publish_twitter: this.state.publishTwitter
        });
    },

    _onStatusChange(newValue) {
        this.setState({status: newValue});
    },

    _onPublishTwitterChange(event) {
        if (!this._isTwitterConnected()) {
            window.onTwitterConnect = ok => {
                if (ok) {
                    this.props.onConnectedServicesChange(
                        this.props.connectedServices.concat(['twitter'])
                    );
                    this.setState({publishTwitter: true});
                } else {
                    alert('연동 실패. 잠시 후 다시 시도해주세요.');
                }
            };
            window.open('/connect/twitter/?popup=true');
        } else {
            this.setState({publishTwitter: event.target.checked});
        }
    },

    _isTwitterConnected() {
        return $.inArray('twitter', this.props.connectedServices) !== -1;
    }
});

module.exports = PostComposer;
