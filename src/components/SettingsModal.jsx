import React from 'react';
import skygear from 'skygear';

import Modal from './Modal.jsx';
import Styles from '../styles/SettingsModal.jsx';

export default class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',     // user display name
      newDisplayName: '',     // new user display name (text input value)
      avatarURL: '',     // user avatar URL
      editingName: false,  // display name editing state
      loading: true   // modal loading state
    };
  }
  componentDidMount() {
    // fetch user profile
    skygear.publicDB.query(
      new skygear.Query(skygear.UserRecord)
      .equalTo('_id', skygear.auth.currentUser.id)
    ).then(([user]) => {
      this.setState({
        loading: false,
        displayName: user.displayName,
        avatarURL: user.avatar ? user.avatar.url : 'img/avatar.svg'
      });
    });
  }
  changeAvatar(imageFile) {
    this.setState({loading: true});
    skygear.publicDB.save(
      new skygear.UserRecord({
        _id: 'user/' + skygear.auth.currentUser.id,
        avatar: new skygear.Asset({
          name: imageFile.name,
          file: imageFile
        })
      })
    ).then(({avatar}) => {
      this.setState({
        loading: false,
        avatarURL: avatar.url
      });
    });
  }
  changeName() {
    const {newDisplayName} = this.state;
    this.setState({loading: true});
    skygear.publicDB.save(
      new skygear.UserRecord({
        _id: 'user/' + skygear.auth.currentUser.id,
        displayName: newDisplayName
      })
    ).then(() => {
      this.setState({
        loading: false,
        displayName: newDisplayName,
        editingName: false
      });
    });
  }
  editName() {
    const {displayName} = this.state;
    this.setState({
      newDisplayName: displayName,
      editingName: true
    });
  }
  logout() {
    this.setState({loading: true});
    skygear.auth.logout().then(() => {
      this.setState({loading: false});
      window.location.href = 'login.html';
    });
  }
  render() {
    const {
      props: {
        onClose
      },
      state: {
        avatarURL,
        displayName,
        newDisplayName,
        editingName,
        loading
      }
    } = this;

    const currentUsername = skygear.auth.currentUser &&
                            skygear.auth.currentUser.username;

    return (
      <Modal
        header="Settings"
        onClose={onClose}>
        <div
          style={Styles.container}>
          <label
            style={{
            }}>
            <input
              type="file"
              accept="image/jpeg,image/png"
              disabled={loading}
              onChange={(e) => this.changeAvatar(e.target.files[0])}
              style={{display: 'none'}}/>
            <div
              style={Object.assign({}, Styles.avatarImg, {
                backgroundImage: `url(${loading ?
                  'img/loading.svg' : avatarURL})`
              })}>
            </div>
            <span
              style={Styles.avatarEdit}>
              edit
            </span>
          </label>
          <div
            style={Styles.centerAlign}>
            <strong>Username: </strong>
            <span>{currentUsername}</span>
          </div>
          {editingName ?
            <div
              style={Styles.centerAlign}>
              <input
                type="text"
                disabled={loading}
                value={newDisplayName}
                onChange={e => {
                  this.setState({newDisplayName: e.target.value});
                }}/>
              <span
                style={Styles.editCancel}
                onClick={() => this.setState({editingName: false})}>
                ✕
              </span>
              <span
                style={Styles.editConfirm}
                onClick={() => this.changeName()}>
                ✓
              </span>
            </div>
           :
            <div
              style={Styles.centerAlign}>
              <strong>Name: </strong>
              <span>
                {displayName}
              </span>
              <img
                src="img/edit.svg"
                style={Styles.editStart}
                onClick={() => this.editName()}/>
            </div>
          }
        </div>
        <div
          style={Styles.logoutContainer}>
          <button
            style={Styles.logoutButton}
            onClick={() => this.logout()}>
            Logout
          </button>
        </div>
      </Modal>
    );
  }
}
