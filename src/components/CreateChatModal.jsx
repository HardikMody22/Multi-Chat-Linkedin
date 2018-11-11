import React from 'react';
import skygearChat from 'skygear-chat';
import UserLoader from '../utils/UserLoader.jsx';
import Modal from './Modal.jsx';
import Styles from '../styles/CreateChatModal.jsx';

export default class CreateChatModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorMessage: ''
    };
  }
  discoverUserAndCreateChat(username) {
    this.setState({loading: true});
    UserLoader.getUsersByUsernames(
      [username]
    ).then(users => {
      if (users.length <= 0) {
        return Promise.reject({message: `user "${username}" not found`});
      }
      return skygearChat.createDirectConversation(users[0], null);
    }).then(conversation => {
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
        errorMessage
      }
    } = this;
    return (
      <Modal
        header="Create Direct Chat"
        onClose={onClose}>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.discoverUserAndCreateChat(
              e.target[0].value
            );
          }}
          style={Styles.formContainer}>
          <label>Username</label>
          <input
            disabled={loading}
            type="text"/>
          <p>{errorMessage}</p>
          <div style={Styles.buttonContainer}>
            <input
              style={Styles.startButton}
              disabled={loading}
              type="submit"
              value="Start" />
          </div>
        </form>
      </Modal>
    );
  }
}
