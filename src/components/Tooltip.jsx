import styled from 'styled-components';
import { useState } from 'react';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: ${props => props.$multiline ? 'normal' : 'nowrap'};
  width: ${props => props.$width || 'auto'};
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }
`;

const TooltipTrigger = styled.span`
  cursor: help;
  display: inline-flex;
  align-items: center;

  &:hover ${TooltipContent} {
    opacity: 1;
    visibility: visible;
  }
`;

function Tooltip({ text, content, children, multiline, width, position = 'top' }) {
  return (
    <TooltipWrapper>
      <TooltipTrigger>
        {children}
        <TooltipContent $multiline={multiline} $width={width}>
          {text || content}
        </TooltipContent>
      </TooltipTrigger>
    </TooltipWrapper>
  );
}

export default Tooltip;
