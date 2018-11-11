import skygearChat from 'skygear-chat';

/**
 * A managed list of messages for the specified conversation.
 */
export default class ManagedMessageList {
  /**
   * @param {Conversation} conversation
   * @param {object} [options={}]
   * @param {number|boolean} [options.initialFetch=50]
   * Fetch messages on creation, provide limit of messages to fetch or false to disable.
   * @param {boolean} [options.pubsubSync=true]
   * Keep list synchronized with server using PubSub.
   * @param {boolean} [options.autoRead=true]
   * Automatically mark all recieved messages as read.
   */
  constructor(conversation, {
    initialFetch = 50,  // fetch messages on creation (int limit of messages or false)
    pubsubSync = true,  // automatically sync list with server using pubsub
    autoRead = true    // automatically mark all recieved messages as read
  } = {}) {
    this._conversation = conversation;
    this._autoRead = autoRead;
    // message IDs in order (without type prefix)
    this._orderedIDs = [];
    // map of message ID => message object
    this._messages = {};
    // map of subscription ID => event handler
    this._updateHandlers = {};

    if (initialFetch) {
      this.fetch(initialFetch);
    }
    if (pubsubSync) {
      skygearChat.subscribe(this._eventHandler.bind(this));
    }
  }
  /**
   * If you used pubsubSync, you must call this function when the list
   * is no longer needed to prevent a memory leak.
   */
  destroy() {
    skygearChat.unsubscribe(this._eventHandler);
  }
  /**
   * @private
   */
  _eventHandler(event) {
    if (
      event.record_type === 'message' &&
      event.record.conversation.id === this._conversation.id
    ) {
      console.log('[message event]', event);
      switch (event.event_type) {
      case 'create':
        this.add(event.record);
        break;
      case 'update':
        this.update(event.record);
        break;
      case 'delete':
        this.remove(event.record._id);
        break;
      }
    }
  }
  /**
   * @private
   */
  _messagesUpdated() {
    const {_messages, _updateHandlers} = this;
    this._orderedIDs = Object.keys(_messages)
      .map(id => _messages[id])
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(message => message._id);
    Object.keys(_updateHandlers)
      .map(key => _updateHandlers[key])
      .forEach(handler => handler(this));
  }
  /**
   * Fetches list of conversations from the server.
   * @param {number} [resultLimit=50]
   * Limit of the number of messages to fetch.
   * @return {Promise<ManagedMessageList>}
   * Promise of this object, resolves if the fetch is successful.
   */
  fetch(resultLimit = 50) {
    return skygearChat
      .getMessages(
        this._conversation,
        resultLimit
      ).then(results => {
        console.log('[fetched messages]', results);
        results.forEach(message => {
          this._messages[message._id] = message;
        });
        if (this._autoRead && results && results.length > 0) {
          skygearChat.markAsRead([results[0]]);
        }
        this._messagesUpdated();
        return this;
      });
  }
  /**
   * List length (like the array length property)
   * @type {number}
   */
  get length() {
    return this._orderedIDs.length;
  }
  /**
   * Get a Message
   * @param {number|string} indexOrID
   * Either the list index (number) or message ID (string) without type prefix.
   * @return {Message}
   */
  get(indexOrID) {
    const {_messages, _orderedIDs} = this;
    if (typeof indexOrID === 'number') {
      return _messages[_orderedIDs[indexOrID]];
    } else {
      return _messages[indexOrID];
    }
  }
  /**
   * List mapping method (like the array map method)
   * @param {function} mappingFunction
   * @return {Array}
   */
  map(mappingFunction) {
    return this._orderedIDs
      .map(id => this._messages[id])
      .map(mappingFunction);
  }
  /**
   * List filter method (like the array filter method)
   * @param {function} predicate
   * @return {Array}
   */
  filter(predicate) {
    return this._orderedIDs
      .map(id => this._messages[id])
      .filter(predicate);
  }
  /**
   * Add a message, no-op if the message already exists.
   * Will mark the message as read if the autoRead option is true.
   * @param {Message} message
   * @return {ManagedMessageList}
   */
  add(message) {
    const {_messages} = this;
    if (!_messages.hasOwnProperty(message._id)) {
      _messages[message._id] = message;
      this._messagesUpdated();
      if (this._autoRead) {
        skygearChat.markAsRead([message]);
      }
    }
    return this;
  }
  /**
   * Update a message, no-op if the message updatedAt date is older than existing.
   * Message will be added if it's not in the list.
   * @param {Message} message
   * @return {ManagedMessageList}
   */
  update(message) {
    const {_messages} = this;
    if (
      _messages.hasOwnProperty(message._id) &&
      message.updatedAt >= _messages[message._id].updatedAt
    ) {
      _messages[message._id] = message;
      this._messagesUpdated();
    } else {
      this.add(message);
    }
    return this;
  }
  /**
   * Remove a message, no-op if the message doesn't exist.
   * @param {string} messageID Message ID without type prefix.
   * @return {ManagedMessageList}
   */
  remove(messageID) {
    const {_messages} = this;
    if (_messages.hasOwnProperty(messageID)) {
      delete _messages[messageID];
      this._messagesUpdated();
    }
    return this;
  }
  /**
   * Subscribe to list updates, handler will be called with one argument: this object.
   * @param {function} handler
   * @return {number} Subscription ID
   */
  subscribe(handler) {
    const {_updateHandlers} = this;
    const subID = Object.keys(_updateHandlers).length;
    _updateHandlers[subID] = handler;
    return subID;
  }
  /**
   * Cancel a subscription.
   * @param {number} subID The subscription ID returned by the subscribe function.
   */
  unsubscribe(subID) {
    delete this._updateHandlers[subID];
  }
}
