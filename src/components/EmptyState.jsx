import styled from 'styled-components';
import { theme } from '../styles/CommonStyles';

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
  color: ${theme.colors.gray600};

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing.lg};
  opacity: 0.5;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.gray900};
  margin-bottom: ${theme.spacing.md};

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: ${theme.colors.gray600};
  margin-bottom: ${theme.spacing.lg};

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background: ${theme.colors.primarySolid};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  margin-right: ${theme.spacing.md};

  &:hover {
    background: ${theme.colors.primaryHover};
  }
`;

function EmptyState({ icon, title, description, action, actionText, secondaryAction, secondaryActionText }) {
    return (
        <EmptyStateContainer>
            {icon && <Icon>{icon}</Icon>}
            <Title>{title}</Title>
            <Description>{description}</Description>
            {action && <ActionButton onClick={action}>{actionText}</ActionButton>}
            {secondaryAction && <ActionButton onClick={secondaryAction} style={{ background: '#e5e7eb', color: '#374151' }}>{secondaryActionText}</ActionButton>}
        </EmptyStateContainer>
    );
}

export default EmptyState;
