import React from 'react';
import skygearChat from 'skygear-chat';

import UserLoader from '../utils/UserLoader.jsx';

import Modal from './Modal.jsx';
import Styles from '../styles/DetailsModal.jsx';

export default class DetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,  // modal loading state (boolean)
      editingTitle: false,  // conversation name editing state (boolean)
      newConversationTitle: '',     // new conversation title (text input value)
      errorMessage: '',     // error message to display
      users: []     // conversation users
    };
  }
  componentDidMount() {
    this.fetchUsers();
  }
  componentDidUpdate(prevProps) {
    if (this.props.conversation.updatedAt > prevProps.conversation.updatedAt) {
      this.fetchUsers();
    }
  }
  fetchUsers() {
    const {conversation} = this.props;
    this.setState({loading: true});
    Promise.all(
      conversation.participant_ids
      .map(userID => UserLoader.get(userID))
    ).then(users => {
      this.setState({
        users,
        loading: false
      });
    });
  }
  editTitle() {
    const {title} = this.props.conversation;
    this.setState({
      newConversationTitle: title,
      editingTitle: true
    });
  }
  changeTitle() {
    const {
      props: {
        conversation,
        updateConversationDelegate
      },
      state: {newConversationTitle}
    } = this;
    this.setState({loading: true});
    skygearChat.updateConversation(
      conversation,
      newConversationTitle
    ).then(newConversation => {
      this.setState({
        loading: false,
        editingTitle: false
      });
      updateConversationDelegate(newConversation);
    });
  }
  leaveConversation() {
    const {
      onClose,
      conversation,
      removeConversationDelegate
    } = this.props;
    this.setState({loading: true});
    skygearChat.leaveConversation(
      conversation
    ).then(() => {
      // close modal after leaving
      onClose();
      removeConversationDelegate(conversation);
    });
  }
  discoverAndAddUser(username) {
    const {
      props: {
        conversation,
        updateConversationDelegate
      },
      state: {users}
    } = this;
    this.setState({loading: true});
    UserLoader.getUsersByUsernames(
      [username]
    ).then(([newUser]) => {
      if (!newUser) {
        return Promise.reject({message: `user "${username}" not found`});
      }
      if (users.filter(u => u.id === newUser.id).length > 0) {
        return Promise.reject({message: `user "${username}" already added`});
      }
      return skygearChat.addParticipants(
        conversation,
        [newUser]
      ).then(() => {
        return skygearChat.addAdmins(
          conversation,
          [newUser]
        );
      });
    }).then(newConversation => {
      this.setState({loading: false});
      updateConversationDelegate(newConversation);
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
        conversation: {
          title: conversationTitle,
          distinct_by_participants: directChat
        },
        onClose
      },
      state: {
        loading,
        editingTitle,
        newConversationTitle,
        errorMessage,
        users
      }
    } = this;

    return (
      <Modal
        header="Details"
        onClose={onClose}>
        <div
          style={Styles.container}>
          <strong style={Styles.conversationName}>
            Conversation Name:
          </strong>
          {editingTitle ?
            <div
              style={Styles.conversationTitle}>
              <input
                type="text"
                disabled={loading}
                value={newConversationTitle}
                onChange={e => {
                  this.setState({newConversationTitle: e.target.value});
                }}/>
              <span
                style={Styles.editCancel}
                onClick={() => this.setState({editingTitle: false})}>
                ✕
              </span>
              <span
                style={Styles.editConfirm}
                onClick={() => this.changeTitle()}>
                ✓
              </span>
            </div>
           :
            <div
              style={Styles.conversationTitle}>
              <span>{conversationTitle || 'Not set.'}</span>
              <img
                src="img/edit.svg"
                style={Styles.editStart}
                onClick={() => this.editTitle()}/>
            </div>
          }
          <strong style={{margin: '2rem 0 0.5rem'}}>
            Participants:
          </strong>
          { loading &&
            <p>loading...</p>
          }
          {
            users.map(u =>
              <div
                key={u.id}
                style={Styles.participant}>
                <div
                  style={Object.assign({},
                    Styles.participantImage,
                    {backgroundImage: `url(${u.avatar ?
                                             u.avatar.url :
                                             'img/avatar.svg'})`}
                    )}>
                </div>
                <span style={Styles.participantName}>
                  {u.displayName}
                </span>
              </div>
            )
          }
          { !directChat &&
            <form
              onSubmit={e => {
                e.preventDefault();
                this.discoverAndAddUser(
                  e.target[1].value
                );
              }}
              style={Styles.participant}>
              <input
                type='submit'
                value='+'
                disabled={loading}
                style={Styles.addParticipant} />
              <input
                type='text'
                disabled={loading}
                style={Styles.addParticipantname} />
            </form>
          }
          <p>{errorMessage}</p>
          { !directChat &&
            <div
              style={Styles.leaveConversation}>
              <button
                style={Styles.leaveButton}
                disabled={loading}
                onClick={() => this.leaveConversation()}>
                Leave Chat
              </button>
            </div>
          }
        </div>
      </Modal>
    );
  }
}
