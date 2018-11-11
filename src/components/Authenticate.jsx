import React from 'react';
import skygear from 'skygear';

import Modal from './Modal.jsx';
import Styles from '../styles/Authenticate.jsx';

function InputField({
  label,    // input label text
  type,     // input type
  required, // required field (boolean)
  disabled, // input disabled (boolean)
  hidden    // input hidden (boolean)
}) {
  if (hidden) {
    return null;
  }
  return (
    <p
      style={Styles.formElement}>
      <label>{label}</label>
      <input
        style={Styles.formInput}
        required={required}
        disabled={disabled}
        type={type}/>
    </p>
  );
}

function ErrorModal({
  message,  // error message
  onClose   // modal close event handler
}) {
  return (
    <Modal
      header="Error"
      onClose={onClose}>
      <div
        style={Styles.modelContainer}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </Modal>
  );
}

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,     // loading state (boolean)
      errorMessage: null  // error message (shown in error modal if non-null)
    };
  }
  login(
    username,
    password
  ) {
    this.setState({loading: true});
    skygear.auth.loginWithUsername(
      username,
      password
    ).then(() => {
      window.location.href = 'app.html';
    }).catch(result => {
      this.setState({
        loading: false,
        errorMessage: result.error.message
      });
    });
  }

  render() {
    const {
      loading,
      errorMessage
    } = this.state;

    return (
      <div
        style={Styles.container}>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.login(
              e.target[0].value,
              e.target[1].value
            );
          }}
          style={Styles.form}>
          <h1 style={{textAlign: 'center'}}>
            Welcome!
          </h1>
          <InputField
            required
            type="text"
            label="Username"
            disabled={loading}/>
          <InputField
            required
            type="password"
            label="Password"
            disabled={loading}/>
          <input
            style={Styles.formButton}
            type="submit"
            disabled={loading}
            value='Login'/>
          <a
            style={{
              textAlign: 'center'
            }}
            href='signup.html'>
            Sign Up
          </a>
        </form>
        {errorMessage &&
          <ErrorModal
            message={errorMessage}
            onClose={() => this.setState({errorMessage: null})}/>
        }
      </div>
    );
  }
}


export class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,     // loading state (boolean)
      errorMessage: null // error message (shown in error modal if non-null)
    };
  }

  signup(
    username,
    password,
    passwordConfirm
  ) {
    if (password !== passwordConfirm) {
      this.setState({errorMessage: 'Passwords do not match.'});
      return;
    }
    this.setState({loading: true});
    skygear.auth.signupWithUsername(
      username,
      password
    ).then(user => {
      return skygear.publicDB.save(
        new skygear.UserRecord({
          _id: `user/${user.id}`,
          displayName: username
        })
      );
    }).then(() => {
      window.location.href = 'app.html';
    }).catch(result => {
      this.setState({
        loading: false,
        errorMessage: result.error.message
      });
    });
  }

  render() {
    const {
      loading,
      errorMessage
    } = this.state;

    return (
      <div
        style={Styles.container}>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.signup(
              e.target[0].value,
              e.target[1].value,
              e.target[2].value
            );
          }}
          style={Styles.form}>
          <h1 style={{textAlign: 'center'}}>
            Signup
          </h1>
          <InputField
            required
            type="text"
            label="Username"
            disabled={loading}/>
          <InputField
            required
            type="password"
            label="Password"
            disabled={loading}/>
          <InputField
            required
            type="password"
            label="Confirm Password"
            disabled={loading}/>
          <input
            style={Styles.formButton}
            type="submit"
            disabled={loading}
            value='Sign Up'/>
          <a
            style={{
              textAlign: 'center'
            }}
            href='login.html'>
            Login
          </a>
        </form>
        {errorMessage &&
          <ErrorModal
            message={errorMessage}
            onClose={() => this.setState({errorMessage: null})}/>
        }
      </div>
    );
  }
}
