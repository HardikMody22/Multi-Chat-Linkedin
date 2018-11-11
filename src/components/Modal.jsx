import React from 'react';
import Styles from '../styles/Modal.jsx';

export default function Modal({
  header,   // Modal header text
  onClose,  // modal close action handler fn
  children  // DOM elements inside modal
}) {
  return (
    <div
      style={Styles.backDrop}>
      <div
        style={Styles.container}>
        <header>
          <span
            style={Styles.close}
            onClick={onClose}>
            ×
          </span>
          <h1 style={Styles.heading}>
            {header}
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
