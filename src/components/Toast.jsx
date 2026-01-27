import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/CommonStyles';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;
`;

const ToastItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 4px solid ${props => {
        if (props.$type === 'success') return '#10B981';
        if (props.$type === 'error') return '#EF4444';
        if (props.$type === 'warning') return '#F59E0B';
        return '#3B82F6';
    }};
  animation: ${props => props.$isClosing ? slideOut : slideIn} 0.3s ease;
  min-width: 300px;
  pointer-events: auto;

  body.dark-theme & {
    background: #2d2d2d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => {
        if (props.$type === 'success') return '#D1FAE5';
        if (props.$type === 'error') return '#FEE2E2';
        if (props.$type === 'warning') return '#FEF3C7';
        return '#DBEAFE';
    }};
  color: ${props => {
        if (props.$type === 'success') return '#10B981';
        if (props.$type === 'error') return '#EF4444';
        if (props.$type === 'warning') return '#F59E0B';
        return '#3B82F6';
    }};
  font-size: 14px;
  font-weight: bold;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${theme.colors.gray900};
  margin-bottom: 2px;

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const Message = styled.div`
  font-size: 13px;
  color: ${theme.colors.gray600};

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.gray400};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  body.dark-theme & {
    color: #6d6d6d;
  }
  
  &:hover {
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray600};

    body.dark-theme & {
      background: #3d3d3d;
      color: #b0b0b0;
    }
  }
`;

const getIcon = (type) => {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        default: return 'ℹ';
    }
};

const getTitle = (type) => {
    switch (type) {
        case 'success': return 'Success';
        case 'error': return 'Error';
        case 'warning': return 'Warning';
        default: return 'Info';
    }
};

function Toast({ toasts, onClose }) {
    return (
        <ToastContainer>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} $type={toast.type} $isClosing={toast.isClosing}>
                    <IconWrapper $type={toast.type}>
                        {getIcon(toast.type)}
                    </IconWrapper>
                    <Content>
                        <Title>{getTitle(toast.type)}</Title>
                        <Message>{toast.message}</Message>
                    </Content>
                    <CloseButton onClick={() => onClose(toast.id)}>
                        ✕
                    </CloseButton>
                </ToastItem>
            ))}
        </ToastContainer>
    );
}

export default Toast;
