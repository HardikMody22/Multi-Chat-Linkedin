import React from 'react';
import skygear from 'skygear';
import skygearChat from 'skygear-chat';

import TypingDetector from '../utils/TypingDetector.jsx';
import ManagedMessageList from '../utils/ManagedMessageList.jsx';
import UserLoader from '../utils/UserLoader.jsx';

import Message from './Message.jsx';
import Styles from '../styles/Conversation.jsx';

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const {title} = props.conversation;
    this.state = {
      title: title || 'loading...', // conversation title (either group name or participant names)
      users: [],                    // array of users in this conversation
      typing: {}                   // map of userID => typing status (boolean)
    };
    this.detectTyping = new TypingDetector(props.conversation);
    this.messageList = new ManagedMessageList(props.conversation);
  }
  componentDidMount() {
    // subscribe message change
    this.messageList.subscribe(() => {
      this.forceUpdate();
    });
    // subscribe to typing events
    skygearChat.subscribeTypingIndicator(
      this.props.conversation,
      this.typingEventHandler.bind(this)
    );
    this.scrollToBottom();
    this.fetchUsers();
  }
  componentDidUpdate(prevProps) {
    this.scrollToBottom();
    if (this.props.conversation.updatedAt > prevProps.conversation.updatedAt) {
      this.fetchUsers();
    }
  }
  componentWillUnmount() {
    this.messageList.destroy();
    skygearChat.unsubscribeTypingIndicator(
      this.props.conversation
    );
  }
  scrollToBottom() {
    // wait for changes to propergate to real DOM
    setTimeout(() => {
      const messageView = document.getElementById('message-view');
      if (messageView) {
        messageView.scrollTop = messageView.scrollHeight;
      }
    }, 100);
  }
  fetchUsers() {
    const {
      title,
      participant_ids
    } = this.props.conversation;
    Promise.all(
      participant_ids
      .map(userID => UserLoader.get(userID))
    ).then(results => {
      let names = results
        .filter(u => u._id !== skygear.auth.currentUser.id)
        .map(u => u.displayName)
        .join(', ');
      if (names.length > 30) {
        names = names.substring(0, 27) + '...';
      }
      let typing = {};
      results.forEach(user => {
        typing[user._id] = false;
      });
      this.setState({
        title: title || names,
        users: results,
        typing
      });
    });
  }
  typingEventHandler(event) {
    console.log('[typing event]', event);
    const {typing} = this.state;
    for (let userID in event) {
      const _id = userID.split('/')[1];
      switch (event[userID].event) {
      case 'begin':
        typing[_id] = true;
        break;
      case 'finished':
        typing[_id] = false;
        break;
      }
    }
    this.setState({typing});
  }
  sendMessage(messageBody) {
    if (messageBody.length > 0) {
      const {conversation} = this.props;
      const message = new skygear.Record('message', {
        body: messageBody,
        metadata: {},
        conversation: new skygear.Reference(conversation.id),
        createdAt: new Date(),
        createdBy: skygear.auth.currentUser.id
      });
      this.messageList.add(message);
      skygear.publicDB.save(message).then(() => {
        // force update the conversation on new message to trigger pubsub event
        skygearChat.markAsRead([message]);
      });
    }
  }
  render() {
    const {
      props: {
        showDetails,
        conversation: {
          participant_ids
        }
      },
      state: {
        title,
        users,
        typing
      },
      messageList
    } = this;
    const currentUserID = skygear.auth.currentUser &&
                          skygear.auth.currentUser.id;

    return (
      <div
        style={Styles.container}>
        <div
          style={Styles.topPanel}>
          <div
            style={Styles.panelContent}>
            <span></span>
            <div
              style={Styles.title}>
              <strong>{title}</strong>
              {` (${participant_ids.length} people)`} <br/>
              <span style={{fontSize: '1rem'}}>
                {
                  (() => {
                    // FIXME: if the user have no displayname, it should
                    // appear someone is typing
                    const names = users
                      .filter(u => u._id !== currentUserID)
                      .filter(u => typing[u._id])
                      .map(u => u.displayName)
                      .join(', ');
                    return names === '' ? '' : `${names} is typing...`;
                  })()
                }
              </span>
            </div>
            <img
              style={Styles.infoImg}
              onClick={showDetails}
              src="img/info.svg"/>
          </div>
        </div>
        <div
          id="message-view"
          style={Styles.messageList}>
          {
            messageList.map((m) =>
              <Message
                key={m.id + m.updatedAt}
                message={m}/>
            )
          }
        </div>
        <div
          style={Styles.messageBox}>
          <form
            style={Styles.messageForm}
            onSubmit={e => {
              e.preventDefault();
              this.sendMessage(e.target[0].value);
              e.target[0].value = '';
            }}>
            <input
              style={Styles.messageInput}
              onChange={() => this.detectTyping()}
              type="text"/>
            <input
              style={Styles.messageSubmit}
              value="Send"
              type="submit"/>
          </form>
        </div>
      </div>
    );
  }
}
