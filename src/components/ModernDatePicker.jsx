import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { theme } from '../styles/CommonStyles';

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  /* Custom DatePicker Styles */
  .react-datepicker {
    font-family: ${theme.fonts.body};
    border: 1px solid ${theme.colors.gray200};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #3d3d3d;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
  }

  .react-datepicker__header {
    background: white;
    border-bottom: 1px solid ${theme.colors.gray200};
    padding-top: 12px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    body.dark-theme & {
      background: #2d2d2d;
      border-bottom-color: #3d3d3d;
    }
  }

  .react-datepicker__current-month {
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.gray900};
    margin-bottom: 8px;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  /* Month and Year Dropdowns */
  .react-datepicker__month-dropdown-container,
  .react-datepicker__year-dropdown-container {
    margin: 0 4px;
  }

  .react-datepicker__month-select,
  .react-datepicker__year-select {
    padding: 4px 8px;
    border: 1px solid ${theme.colors.gray300};
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.gray900};
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;

    body.dark-theme & {
      background: #1f1f1f;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    &:hover {
      border-color: #6366f1;
    }

    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
  }

  .react-datepicker__day-names {
    margin-top: 8px;
  }

  .react-datepicker__day-name {
    color: ${theme.colors.gray600};
    font-size: 13px;
    font-weight: 500;
    width: 36px;
    line-height: 36px;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  .react-datepicker__day {
    width: 36px;
    line-height: 36px;
    font-size: 14px;
    color: ${theme.colors.gray700};
    border-radius: 6px;
    transition: all 0.2s ease;

    body.dark-theme & {
      color: #e5e5e5;
    }

    &:hover {
      background: #eef2ff;
      color: #6366f1;

      body.dark-theme & {
        background: #3d2d5d;
        color: #a78bfa;
      }
    }
  }

  .react-datepicker__day--selected {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
    color: white !important;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);

    body.dark-theme & {
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.5);
    }
  }

  .react-datepicker__day--keyboard-selected {
    background: #eef2ff;
    color: #6366f1;

    body.dark-theme & {
      background: #3d2d5d;
      color: #a78bfa;
    }
  }

  .react-datepicker__day--today {
    font-weight: 600;
    color: #6366f1;
    border: 2px solid #6366f1;

    body.dark-theme & {
      color: #a78bfa;
      border-color: #7c3aed;
    }
  }

  .react-datepicker__day--outside-month {
    color: ${theme.colors.gray400};

    body.dark-theme & {
      color: #4d4d4d;
    }
  }

  .react-datepicker__navigation {
    top: 12px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: ${theme.colors.gray600};

    body.dark-theme & {
      border-color: #b0b0b0;
    }
  }

  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #6366f1;
  }

  /* Month View */
  .react-datepicker__month {
    margin: 8px;
  }

  /* Year Dropdown */
  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown {
    background: white;
    border: 1px solid ${theme.colors.gray200};
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #3d3d3d;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
  }

  .react-datepicker__year-option,
  .react-datepicker__month-option {
    padding: 8px 12px;
    font-size: 14px;
    color: ${theme.colors.gray700};
    cursor: pointer;

    body.dark-theme & {
      color: #e5e5e5;
    }

    &:hover {
      background: #eef2ff;
      color: #6366f1;

      body.dark-theme & {
        background: #3d2d5d;
        color: #a78bfa;
      }
    }
  }

  .react-datepicker__year-option--selected,
  .react-datepicker__month-option--selected {
    background: #6366f1;
    color: white;
    font-weight: 600;

    body.dark-theme & {
      background: #7c3aed;
    }
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 44px;
  border: 2px solid ${theme.colors.gray300};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: ${theme.colors.gray900};
  background: #fafafa;
  transition: all 0.2s ease;
  font-family: ${theme.fonts.body};
  cursor: pointer;

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
    color: #e5e5e5;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);

    body.dark-theme & {
      background: #353535;
      border-color: #7c3aed;
    }
  }

  &:hover {
    border-color: #6366f1;
    background: white;

    body.dark-theme & {
      background: #353535;
      border-color: #7c3aed;
    }
  }

  &::placeholder {
    color: ${theme.colors.gray500};
    font-weight: 400;

    body.dark-theme & {
      color: #6d6d6d;
    }
  }

  &:read-only {
    cursor: pointer;
  }
`;

const CalendarIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
  }
`;

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div style={{ position: 'relative', width: '100%' }}>
        <StyledInput
            onClick={onClick}
            value={value}
            placeholder={placeholder}
            readOnly
            ref={ref}
        />
        <CalendarIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        </CalendarIcon>
    </div>
));

CustomInput.displayName = 'CustomInput';

function ModernDatePicker({ value, onChange, name, placeholder = "dd - mm - yyyy", ...props }) {
    const selectedDate = value ? new Date(value) : null;

    const handleChange = (date) => {
        if (onChange && name) {
            const formattedDate = date ? date.toISOString().split('T')[0] : '';
            onChange({
                target: {
                    name: name,
                    value: formattedDate
                }
            });
        }
    };

    return (
        <DatePickerWrapper>
            <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                customInput={<CustomInput placeholder={placeholder} />}
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                {...props}
            />
        </DatePickerWrapper>
    );
}

export default ModernDatePicker;
