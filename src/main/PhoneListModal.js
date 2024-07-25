import React from 'react';
import Modal from 'react-modal';
import PhoneList from './PhoneList';

Modal.setAppElement('#root');  // Add this line if you encounter accessibility warnings

const PhoneListModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Phone List Modal"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '80%',
          overflow: 'auto'
        }
      }}
    >
      <button onClick={onRequestClose} style={{ float: 'right' }}>Close</button>
      <PhoneList />
    </Modal>
  );
};

export default PhoneListModal;
