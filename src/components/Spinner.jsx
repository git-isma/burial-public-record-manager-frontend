import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Spin = styled.div`
  width: ${props => props.$size || '20px'};
  height: ${props => props.$size || '20px'};
  border: ${props => props.$thickness || '3px'} solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export function InlineSpinner({ size = '16px', thickness = '2px' }) {
  return (
    <SpinnerContainer>
      <Spin $size={size} $thickness={thickness} />
    </SpinnerContainer>
  );
}

export default InlineSpinner;
