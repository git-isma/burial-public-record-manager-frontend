import styled from 'styled-components';

export const theme = {
  colors: {
    primary: '#6366f1',
    primarySolid: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#818cf8',
    primaryDark: '#4338ca',
    secondary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    verified: '#10B981',
    verifiedBg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    pending: '#F59E0B',
    pendingBg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    completed: '#3B82F6',
    completedBg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    rejected: '#EF4444',
    rejectedBg: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',
    white: '#FFFFFF',
    black: '#000000',
    bgPrimary: '#FFFFFF',
    bgSecondary: '#f9fafb',
    bgSidebar: '#ffffff',
    bgGradient: '#6366f1',
    bgCard: '#FFFFFF',
    bgCardHover: '#f9fafb',
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    textLight: '#A1A1AA',
    textWhite: '#FFFFFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px -1px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px -3px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 30px -5px rgba(0, 0, 0, 0.18)',
    '2xl': '0 30px 60px -12px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 25px rgba(124, 58, 237, 0.4)',
    glowHover: '0 0 35px rgba(124, 58, 237, 0.6)',
    card: '0 4px 20px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 30px rgba(0, 0, 0, 0.12)',
  }
};

export const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.gray200};
  transition: all ${theme.transitions.base};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #404040;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl};
    margin-bottom: ${theme.spacing.xl};
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);

    body.dark-theme & {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }
`;

export const Button = styled.button`
  background: ${props => {
    if (props.$variant === 'primary') return '#6366f1';
    if (props.$variant === 'danger') return theme.colors.danger;
    if (props.$variant === 'secondary') return 'white';
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'warning') return theme.colors.warning;
    return '#6366f1';
  }};
  color: ${props => props.$variant === 'secondary' ? theme.colors.gray700 : 'white'};
  padding: ${props => props.$size === 'small' ? '8px 14px' : '10px 18px'};
  font-size: ${props => props.$size === 'small' ? '12px' : '13px'};
  font-weight: 600;
  font-family: ${theme.fonts.body};
  border-radius: ${theme.borderRadius.md};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${theme.colors.gray300}` : 'none'};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  margin-right: ${props => props.$marginRight || '0'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
  min-height: 40px;
  min-width: 40px;
  touch-action: manipulation;

  @media (min-width: 768px) {
    padding: ${props => props.$size === 'small' ? '8px 16px' : '10px 20px'};
    font-size: ${props => props.$size === 'small' ? '13px' : '14px'};
    min-height: auto;
    min-width: auto;
  }

  body.dark-theme & {
    ${props => props.$variant === 'secondary' && `
      background: #2d2d2d;
      border-color: #404040;
      color: #e5e5e5;
    `}
    ${props => props.$variant === 'primary' && `
      background: #7c3aed;
    `}
  }

  &:hover:not(:disabled) {
    background: ${props => {
    if (props.$variant === 'primary') return '#4f46e5';
    if (props.$variant === 'secondary') return theme.colors.gray50;
    return props.$variant === 'danger' ? '#dc2626' : props.$variant === 'success' ? '#059669' : '#d97706';
  }};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    body.dark-theme & {
      ${props => props.$variant === 'secondary' && `
        background: #353535;
      `}
      ${props => props.$variant === 'primary' && `
        background: #6d28d9;
      `}
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${theme.colors.gray700};
    font-size: 13px;

    body.dark-theme & {
      color: #b0b0b0;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${theme.colors.gray200};
    border-radius: ${theme.borderRadius.lg};
    font-size: 16px;
    transition: all ${theme.transitions.base};
    font-family: inherit;
    background: ${theme.colors.white};
    min-height: 44px;
    touch-action: manipulation;

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #404040;
      color: #e5e5e5;
    }

    @media (min-width: 768px) {
      font-size: 14px;
      min-height: auto;
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
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 6 9 11 4"></polyline></svg>');
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;

    body.dark-theme & {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="%23a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 6 9 11 4"></polyline></svg>');
    }

    option {
      background: white;
      color: ${theme.colors.gray900};
      padding: 8px;

      body.dark-theme & {
        background: #2d2d2d;
        color: #e5e5e5;
      }
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.lg};
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
  }
`;

export const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  h1 {
    font-size: 20px;
    font-weight: 700;
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.sm} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }

    @media (min-width: 768px) {
      font-size: 24px;
    }
  }

  p {
    color: ${theme.colors.gray600};
    font-size: 13px;
    margin: 0;
    font-family: ${theme.fonts.body};

    body.dark-theme & {
      color: #a0a0a0;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }

  button {
    width: 100%;

    @media (min-width: 768px) {
      width: auto;
    }
  }
`;

export const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    if (props.$status === 'Verified') return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
    if (props.$status === 'Completed') return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    if (props.$status === 'Rejected') return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
  }};
  color: ${props => {
    if (props.$status === 'Verified') return theme.colors.success;
    if (props.$status === 'Completed') return theme.colors.info;
    if (props.$status === 'Rejected') return theme.colors.danger;
    return theme.colors.warning;
  }};
  box-shadow: ${theme.shadows.sm};
`;
