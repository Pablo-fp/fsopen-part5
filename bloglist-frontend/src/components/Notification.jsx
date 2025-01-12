import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message }) => {
  if (!message || !message.type || !message.content) {
    return null; // Return null if there's no valid message
  }

  return <div className={message.type}>{message.content}</div>;
};

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error']), // Restrict to 'success' or 'error'
    content: PropTypes.string // Ensure content is a string
  })
};

Notification.defaultProps = {
  message: null // Default to null if no message is provided
};

export default Notification;
