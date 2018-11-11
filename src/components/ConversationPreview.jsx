import React from 'react';
import skygear from 'skygear';

import UserLoader from '../utils/UserLoader.jsx';
import Styles from '../styles/ConversationPreview.jsx';

export default class ConversationPreview extends React.Component {
  constructor(props) {
    super(props);
    const {title} = props.conversation;
    this.state = {
      title: title || 'loading...',    // conversation title (either group name or participant names)
      imageURL: 'img/loading.svg'      // conversation image URL
    };
  }
  componentDidMount() {
    const {
      title,
      participant_ids
    } = this.props.conversation;
    // fetch users
    Promise.all(
      participant_ids
      .map(userID => UserLoader.get(userID))
    ).then(users => {
      if (users.length > 1) {
        users = users.filter(u => u._id !== skygear.auth.currentUser.id);
      }
      let names = users
        .map(u => u.displayName)
        .join(', ');
      if (names.length > 30) {
        names = names.substring(0, 27) + '...';
      }
      let avatar = 'img/avatar.svg';
      if (users[0]) {
        avatar = users[0].avatar ? users[0].avatar.url : 'img/avatar.svg';
      }
      this.setState({
        title: title || names,
        imageURL: avatar
      });
    });
  }
  render() {
    const {
      selected,
      onClick
    } = this.props;
    const {
      unread_count
    } = this.props.conversation;
    const {
      title,
      imageURL
    } = this.state;
    const lastMessage = this.props.conversation.$transient.last_message;

    return (
      <div
        onClick={onClick}
        style={Object.assign({}, Styles.container, {
          backgroundColor: selected ? '#EEE' : '#FFF'
        })}>
        <div
          style={Object.assign({}, Styles.conversationImg, {
            backgroundImage: `url(${imageURL})`
          })}>
        </div>
        <div
          style={Styles.conversationTitle}>
          <h2 style={Styles.title}>{title}</h2>
          {lastMessage &&
            <span
              style={Styles.lastMessage}>
              { lastMessage.body.length > 23 ?
                  lastMessage.body.substring(0, 20) + '...' : lastMessage.body }
            </span>
          }
        </div>
        <span>
          {unread_count > 0 ? `(${unread_count})` : ''}
        </span>
      </div>
    );
  }
}
