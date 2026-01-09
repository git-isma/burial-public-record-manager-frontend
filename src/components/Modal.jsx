import styled from 'styled-components';
import { theme } from '../styles/CommonStyles';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  body.dark-theme & {
    background: #2d2d2d;
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.gray900};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  p {
    font-size: 14px;
    color: ${theme.colors.gray600};
    margin-bottom: ${theme.spacing.lg};
    line-height: 1.5;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;

  button {
    padding: 10px 20px;
    border-radius: ${theme.borderRadius.md};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all ${theme.transitions.fast};
    min-height: 44px;

    &.confirm {
      background: ${props => props.$variant === 'danger' ? '#ef4444' : theme.colors.primarySolid};
      color: white;
      &:hover { opacity: 0.9; }
    }

    &.cancel {
      background: ${theme.colors.gray200};
      color: ${theme.colors.gray700};
      &:hover { background: ${theme.colors.gray300}; }

      body.dark-theme & {
        background: #3d3d3d;
        color: #e5e5e5;
      }
    }
  }
`;

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <ButtonGroup $variant={variant}>
          <button className="cancel" onClick={onClose}>{cancelText}</button>
          <button className="confirm" onClick={onConfirm}>{confirmText}</button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
