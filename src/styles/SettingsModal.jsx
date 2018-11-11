const Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem 0',
    width: '18rem'
  },

  avatarLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  avatarImg: {
    border: '1px solid #000',
    borderRadius: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    width: '5rem',
    height: '5rem'
  },

  avatarEdit: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },

  centerAlign: {
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

  logoutContainer: {
    width: '100%',
    textAlign: 'center'
  },

  logoutButton: {
    background: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem'
  }
};

export default Styles;
