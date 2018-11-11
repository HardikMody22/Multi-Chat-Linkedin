import React from 'react';
import skygearChat from 'skygear-chat';

import ManagedConversationList from '../utils/ManagedConversationList.jsx';

import Conversation from './Conversation.jsx';
import ConversationPreview from './ConversationPreview.jsx';
import CreateChatModal from './CreateChatModal.jsx';
import CreateGroupModal from './CreateGroupModal.jsx';
import SettingsModal from './SettingsModal.jsx';
import DetailsModal from './DetailsModal.jsx';
import Styles from '../styles/App.jsx';


function AddButton({
  text,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      style={Styles.addButton}>
      + {text}
    </button>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unreadCount: 0,    // user's total unread message count (int)
      currentModal: null, // currently displayed modal dialog name (or null)
      activeID: null // currently selected UserConversion ID (or null)
    };
    this.ConversationList = new ManagedConversationList();
  }

  componentDidMount() {
    // subscribe conversation change
    this.ConversationList.subscribe(() => {
      this.forceUpdate();
      this.updateUnreadCount();
    });
    this.updateUnreadCount();
  }

  updateUnreadCount() {
    skygearChat.getUnreadCount().then(result => {
      this.setState({unreadCount: result.message});
    });
  }

  selectConversation(conversation) {
    this.setState({
      activeID: conversation._id,
      unreadCount: this.state.unreadCount - conversation.unread_count
    });
    conversation.unread_count = 0;
    this.updateUnreadCount();
  }

  render() {
    const {
      state: {
        unreadCount,
        currentModal,
        activeID
      },
      ConversationList
    } = this;
    const activeConversation = ConversationList.get(activeID);

    return (
      <div
        style={Styles.root}>
        <div
          style={Styles.leftPanel}>
          <div
            style={Styles.settingPanel}>
            <span>{unreadCount > 0 ? `(${unreadCount})` : ''}</span>
            <h1>Chats</h1>
            <img
              src="img/gear.svg"
              style={Styles.settingImg}
              onClick={() => this.setState({currentModal: 'settings'})}/>
          </div>
          <div
            style={Styles.creationPanel}>
            <AddButton
              text="Direct Chat"
              onClick={() => this.setState({currentModal: 'createChat'})}/>
            <AddButton
              text="Group"
              onClick={() => this.setState({currentModal: 'createGroup'})}/>
          </div>
          <div style={Styles.conversationContainer}>
            {
              ConversationList
                .map((c) => {
                  return <ConversationPreview
                    key={'ConversationPreview-' + c.id + c.updatedAt}
                    selected={
                      c.id === activeID}
                    conversation={c}
                    onClick={() => this.selectConversation(c)}/>;
                })
            }
          </div>
        </div>
        {activeID &&
          <Conversation
            key={'Conversation-' + activeID}
            conversation={activeConversation}
            showDetails={() => this.setState({currentModal: 'details'})}/>
        }
        {(modal => {
          switch (modal) {
          case 'createGroup':
            return (
                <CreateGroupModal
                  addConversationDelegate={c =>
                                           ConversationList.addConversation(c)}
                  onClose={() => this.setState({currentModal: null})}/>
            );
          case 'createChat':
            return (
                <CreateChatModal
                  addConversationDelegate={c =>
                                           ConversationList.addConversation(c)}
                  onClose={() => this.setState({currentModal: null})}/>
            );
          case 'settings':
            return (
                <SettingsModal
                  onClose={() => this.setState({currentModal: null})}/>
            );
          case 'details':
            return (
                <DetailsModal
                  key={'DetailsModal-' + activeID.id}
                  conversation={activeConversation}
                  updateConversationDelegate={c =>
                                              ConversationList
                                              .updateConversation(c)}
                  removeConversationDelegate={c =>
                                              ConversationList
                                              .removeConversation(c)}
                  onClose={() => this.setState({currentModal: null})}/>
            );
          default:
            return null;
          }
        })(currentModal)}
      </div>
    );
  }
}
