import React, { useState } from 'react';
import Modal from '../common/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const switchToLogin = () => {
    setAuthMode('login');
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const handleClose = () => {
    setAuthMode('login'); // Reset to login when modal closes
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        {authMode === 'login' ? (
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;