import styled, { keyframes } from 'styled-components';
import { theme, Button } from '../styles/CommonStyles';
import { MdWarning, MdEdit } from 'react-icons/md';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(40px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} ${theme.transitions.base};
  padding: ${theme.spacing.md};

  @media (min-width: 768px) {
    padding: ${theme.spacing.lg};
  }
`;

const ModalContent = styled.div`
  background: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  padding: 0;
  max-width: ${props => props.$maxWidth || '520px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: ${theme.shadows['2xl']};
  animation: ${slideUp} ${theme.transitions.slow};
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  }

  @media (min-width: 768px) {
    border-radius: ${theme.borderRadius['2xl']};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.gray200};
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  gap: ${theme.spacing.md};

  body.dark-theme & {
    background: #1f1f1f;
    border-bottom-color: #3d3d3d;
  }

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl} ${theme.spacing['2xl']};
  }

  h2 {
    margin: 0;
    font-size: ${theme.fontSizes.lg};
    font-weight: 700;
    color: ${theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    flex: 1;
    min-width: 0;

    body.dark-theme & {
      color: #e5e5e5;
    }

    @media (min-width: 768px) {
      font-size: ${theme.fontSizes['2xl']};
    }
  }
`;

const CloseButton = styled.button`
  background: ${theme.colors.gray100};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${theme.colors.gray600};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  flex-shrink: 0;

  body.dark-theme & {
    background: #3d3d3d;
    color: #b0b0b0;
  }

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  &:hover {
    background: ${theme.colors.danger};
    color: white;
    transform: rotate(90deg) scale(1.1);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  overflow-y: auto;
  flex: 1;

  body.dark-theme & {
    color: #e5e5e5;
  }

  @media (min-width: 768px) {
    padding: ${theme.spacing['2xl']};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
  flex-wrap: wrap;

  body.dark-theme & {
    background: #1f1f1f;
    border-top-color: #3d3d3d;
  }

  @media (min-width: 768px) {
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.xl} ${theme.spacing['2xl']};
  }

  button {
    flex: 1;
    min-width: 100px;

    @media (min-width: 768px) {
      flex: auto;
    }
  }
`;

export const Modal = ({ isOpen, onClose, title, children, maxWidth, footer, icon }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </ModalOverlay>
  );
};

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const ConfirmIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto ${theme.spacing.lg};
  animation: ${pulse} 2s ease-in-out infinite;
  background: ${props => {
    if (props.$variant === 'danger') return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    if (props.$variant === 'success') return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
    if (props.$variant === 'warning') return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
    return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
  }};
  color: ${props => {
    if (props.$variant === 'danger') return theme.colors.danger;
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'warning') return theme.colors.warning;
    return theme.colors.info;
  }};
  box-shadow: ${props => {
    if (props.$variant === 'danger') return '0 10px 30px rgba(239, 68, 68, 0.3)';
    if (props.$variant === 'success') return '0 10px 30px rgba(16, 185, 129, 0.3)';
    if (props.$variant === 'warning') return '0 10px 30px rgba(245, 158, 11, 0.3)';
    return '0 10px 30px rgba(6, 182, 212, 0.3)';
  }};

  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 40px;
    margin: 0 auto ${theme.spacing.xl};
  }
`;

const ConfirmMessage = styled.div`
  margin: 0;
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-size: ${theme.fontSizes.base};
  line-height: 1.7;
  font-weight: 500;

  body.dark-theme & {
    color: #b0b0b0;
  }

  @media (min-width: 768px) {
    font-size: ${theme.fontSizes.lg};
  }
`;

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon = <MdWarning size={32} />
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="480px"
      footer={
        <>
          <Button $variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button $variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <ConfirmIcon $variant={variant}>{icon}</ConfirmIcon>
        <ConfirmMessage>{message}</ConfirmMessage>
      </div>
    </Modal>
  );
};

const InputField = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.base};
  transition: all ${theme.transitions.base};
  font-family: ${theme.fonts.body};
  background: ${theme.colors.white};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primarySolid};
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
    background: #fafbff;

    body.dark-theme & {
      background: #353535;
      border-color: #7c3aed;
    }
  }

  &::placeholder {
    color: ${theme.colors.gray400};

    body.dark-theme & {
      color: #6d6d6d;
    }
  }
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.md};
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSizes.base};

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

export const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
  value,
  onChange,
  submitText = 'Submit',
  type = 'text',
  icon = <MdEdit size={32} />
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={icon}
      maxWidth="480px"
      footer={
        <>
          <Button $variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button $variant="primary" onClick={onSubmit}>
            {submitText}
          </Button>
        </>
      }
    >
      <div>
        <InputLabel>{label}</InputLabel>
        <InputField
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus
        />
      </div>
    </Modal>
  );
};

export default Modal;
