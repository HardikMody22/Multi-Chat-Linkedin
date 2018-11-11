const Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '21rem',
    padding: '1rem'
  },

  conversationName: {
    margin: '2rem 0 0.5rem'
  },

  conversationTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem'
  },

  editStart: {
    marginLeft: '1rem',
    height: '1rem',
    cursor: 'pointer'
  },

  editCancel: {
    cursor: 'pointer',
    fontSize: '1.3rem'
  },

  editConfirm: {
    cursor: 'pointer',
    fontSize: '1.5rem'
  },

  participant: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.5rem 0'
  },

  participantImage: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '3rem',
    height: '3rem'
  },

  participantName: {
    marginLeft: '1rem'
  },

  addParticipant: {
    border: '1px solid #000',
    borderRadius: '100%',
    minWidth: '3rem',
    width: '3rem',
    height: '3rem',
    fontSize: '2rem',
    backgroundColor: '#FFF',
    cursor: 'pointer'
  },

  addParticipantName: {
    marginLeft: '1rem',
    width: '100%'
  },

  leaveConversation: {
    alignSelf: 'center',
    marginTop: '2rem'
  },

  leaveButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem',
    cursor: 'pointer'
  }

};

export default Styles;
