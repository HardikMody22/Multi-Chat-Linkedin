import React from 'react';
import skygearChat from 'skygear-chat';
import UserLoader from '../utils/UserLoader.jsx';
import Modal from './Modal.jsx';
import Styles from '../styles/CreateGroupModal.jsx';

export default class CreateGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,  // modal loading state (boolean)
      errorMessage: '',     // error message to display (or '')
      members: [],     // list of members (users) to add to the new group
      groupName: ''     // group name input text
    };
  }
  discoverUser(username) {
    this.setState({loading: true});
    UserLoader.getUsersByUsernames(
      [username]
    ).then(users => {
      if (users.length <= 0) {
        return Promise.reject({message: `user "${username}" not found`});
      }
      const {members} = this.state;
      if (members.filter(u => u.id === users[0].id).length > 0) {
        return Promise.reject({
          message: `Error: user "${username}" already added`
        });
      }
      members.push(users[0]);
      this.setState({
        loading: false,
        errorMessage: '',
        members
      });
    }).catch(err => {
      this.setState({
        loading: false,
        errorMessage: `Error: ${err.message}`
      });
    });
  }
  createGroup() {
    const {
      members,
      groupName
    } = this.state;
    if (groupName === '') {
      this.setState({errorMessage: 'Error: missing group name'});
      return;
    }
    if (members.length < 2) {
      this.setState({
        errorMessage: 'Error: groups must have 3 or more participants'
      });
      return;
    }
    this.setState({loading: true});
    skygearChat.createConversation(
      members,
      groupName
    ).then(conversation => {
      // close modal after creation
      this.props.onClose();
      this.props.addConversationDelegate(conversation);
    }).catch(err => {
      this.setState({
        loading: false,
        errorMessage: `Error: ${err.message}`
      });
    });
  }
  render() {
    const {
      props: {
        onClose
      },
      state: {
        loading,
        errorMessage,
        groupName,
        members
      }
    } = this;

    return (
      <Modal
        header="Create Group Chat"
        onClose={onClose}>
        <div
          style={Styles.container}>
          <strong style={Styles.label}>
            Name:
          </strong>
          <input
            type="text"
            disabled={loading}
            value={groupName}
            onChange={e => this.setState({groupName: e.target.value})} />
          <strong style={Styles.label}>
            Participants:
          </strong>
          {
            members.map(user =>
              <div
                key={user.id}
                style={Styles.member}>
                <div
                  style={Object.assign({}, Styles.avatar, {
                    backgroundImage: `url(${user.avatar ?
                        user.avatar.url : 'img/avatar.svg'})`
                  })}>
                </div>
                <span>
                  {user.displayName}
                </span>
              </div>
            )
          }
          <form
            onSubmit={e => {
              e.preventDefault();
              this.discoverUser(
                e.target[1].value
              );
            }}
            style={Styles.formContainer}>
            <input
              type='submit'
              value='+'
              disabled={loading}
              style={Styles.addButton}
              />
            <input
              type='text'
              disabled={loading}
              style={Styles.usernameInput}
              />
          </form>
          <p>{errorMessage}</p>
          <div
            style={Styles.buttonContainer}>
            <button
              style={Styles.createButton}
              disabled={loading}
              onClick={() => this.createGroup()}>
              Create Group
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
