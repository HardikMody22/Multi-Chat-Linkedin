const Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '75%',
    height: '100%'
  },

  topPanel: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '6rem',
    borderBottom: '1px solid #000'
  },

  title: {
    textAlign: 'center',
    fontSize: '1.5rem'
  },

  panelContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },

  infoImg: {
    height: '2rem',
    cursor: 'pointer',
    marginRight: '2rem'
  },

  messageList: {
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll'
  },

  messageBox: {
    width: '100%',
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #000'
  },

  messageForm: {
    width: '100%',
    margin: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  messageInput: {
    padding: '0.25rem',
    fontSize: '1rem',
    width: '100%'
  },

  messageSubmit: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '0.5rem 1rem',
    marginLeft: '1rem'
  }

};

export default Styles;
