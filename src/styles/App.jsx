const Styles = {
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowX: 'scroll'
  },

  leftPanel: {
    height: '100%',
    width: '25%',
    minWidth: '400px',
    borderRight: '1px solid #888',
    display: 'flex',
    flexDirection: 'column'
  },

  settingPanel: {
    height: '2rem',
    minHeight: '2rem',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #888'
  },

  settingImg: {
    cursor: 'pointer',
    height: '2rem'
  },

  creationPanel: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #888',
    height: '4rem',
    minHeight: '4rem'
  },

  conversationContainer: {
    overflowY: 'scroll'
  },

  addButton: {
    backgroundColor: '#FFF',
    border: '1px solid #000',
    padding: '1rem 2rem',
    cursor: 'pointer'
  }

};

export default Styles;
