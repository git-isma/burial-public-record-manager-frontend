import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../utils/api';
import { generateReceiptPDF } from '../utils/receiptGenerator';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { Card, PageHeader, Button, theme } from '../styles/CommonStyles';
import { MdDownload, MdDescription, MdCalendarToday, MdPerson, MdLocationOn, MdCheckCircle, MdEmail, MdArrowBack, MdErrorOutline } from 'react-icons/md';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

const RecordsContainer = styled.div`
  font-family: ${theme.fonts.body};
`;

const FilterSection = styled(Card)`
  margin-bottom: ${theme.spacing.xl};
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const EntryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: ${theme.spacing.xl} 0;
`;

const EntryCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  padding: ${theme.spacing.xl};
  text-align: center;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.md} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  p {
    color: ${theme.colors.gray600};
    margin-bottom: ${theme.spacing.xl};
    line-height: 1.5;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-size: 13px;
    font-weight: 500;
    color: ${theme.colors.gray700};
    margin-bottom: 6px;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
  input, select {
    padding: 10px 12px;
    border: 1px solid ${theme.colors.gray300};
    border-radius: ${theme.borderRadius.md};
    font-size: 14px;
    color: ${theme.colors.textPrimary};
    background: white;
    transition: all ${theme.transitions.fast};

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    &:focus {
      outline: none;
      border-color: ${theme.colors.primarySolid};
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);

      body.dark-theme & {
        border-color: #7c3aed;
      }
    }
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  button {
    width: 100%;

    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const RecordsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RecordCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.base};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primarySolid} 0%, #8b5cf6 100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    body.dark-theme & {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    border-bottom-color: #3d3d3d;
  }
`;

const RecordNumber = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.primarySolid};
  font-family: 'Courier New', monospace;

  body.dark-theme & {
    color: #a78bfa;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: ${theme.borderRadius.full};
  font-size: 11px;
  font-weight: 600;
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
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  font-size: 14px;

  .icon {
    color: ${theme.colors.primarySolid};
    flex-shrink: 0;
    margin-top: 2px;

    body.dark-theme & {
      color: #a78bfa;
    }
  }

  .label {
    color: ${theme.colors.gray600};
    font-weight: 500;
    min-width: 100px;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  .value {
    color: ${theme.colors.gray900};
    font-weight: 600;
    flex: 1;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const RejectionInfo = styled.div`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.danger};
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  .icon {
    margin-top: 2px;
    flex-shrink: 0;
  }

  body.dark-theme & {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    border-top-color: #3d3d3d;
  }
`;

const DownloadButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    border-top-color: #3d3d3d;
  }

  button {
    padding: 8px 12px;
    background: white;
    border: 1px solid ${theme.colors.gray300};
    border-radius: ${theme.borderRadius.md};
    color: ${theme.colors.gray700};
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    min-width: 36px;
    transition: all ${theme.transitions.fast};

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    &:hover:not(:disabled) {
      background: ${theme.colors.gray50};
      border-color: ${theme.colors.primarySolid};
      color: ${theme.colors.primarySolid};

      body.dark-theme & {
        background: #353535;
        border-color: #7c3aed;
        color: #a78bfa;
      }
    }
    &.active {
      background: ${theme.colors.primarySolid};
      color: white;
      border-color: ${theme.colors.primarySolid};

      body.dark-theme & {
        background: #7c3aed;
        border-color: #7c3aed;
      }
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  span {
    color: ${theme.colors.gray400};
    padding: 0 4px;

    body.dark-theme & {
      color: #6d6d6d;
    }
  }
`;

function Records() {
  const navigate = useNavigate();
  const { formatDate } = useSettings();
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', deceasedName: '' });
  const [applicantEmail, setApplicantEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Load email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('burial_applicant_email');
    if (savedEmail) {
      setApplicantEmail(savedEmail);
      setEmailInput(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (applicantEmail) {
      fetchRecords();
    }
  }, [applicantEmail, pagination.currentPage]);

  const fetchRecords = async (overrides = {}) => {
    setLoading(true);
    try {
      if (!applicantEmail) return;

      const currentFilters = overrides.filters || filters;
      const currentPage = overrides.page || pagination.currentPage;
      
      const payload = {
        page: currentPage,
        limit: 12,
        applicantEmail
      };
      // Only add filters if they have values
      if (currentFilters.status) payload.status = currentFilters.status;
      if (currentFilters.deceasedName) payload.deceasedName = currentFilters.deceasedName;

      const res = await apiService.getPublicRecords(payload);
      setRecords(res.data.data || []);
      setPagination({
        currentPage: res.data.currentPage || 1,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || 0
      });
    } catch (err) {
      console.error('Error fetching records:', err);
      showToast(err.response?.data?.message || 'Failed to load records', 'error');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const newPage = 1;
    setPagination({ ...pagination, currentPage: newPage });
    fetchRecords({ page: newPage });
  };

  const resetFilters = () => {
    const emptyFilters = { status: '', deceasedName: '' };
    const newPage = 1;
    setFilters(emptyFilters);
    setPagination({ ...pagination, currentPage: newPage });
    fetchRecords({ filters: emptyFilters, page: newPage });
  };

  const handleDownloadReceipt = async (record) => {
    try {
      showToast('Generating receipt PDF...', 'info');
      generateReceiptPDF(record, formatDate);
      showToast('Receipt downloaded successfully!', 'success');
    } catch (err) {
      console.error('Error generating receipt:', err);
      showToast('Failed to generate receipt', 'error');
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }
    setApplicantEmail(emailInput.trim());
    localStorage.setItem('burial_applicant_email', emailInput.trim());
    setPagination({ ...pagination, currentPage: 1 });
  };

  const clearApplicantEmail = () => {
    setApplicantEmail('');
    setRecords([]);
    setFilters({ status: '', deceasedName: '' });
    setEmailInput('');
    localStorage.removeItem('burial_applicant_email');
  };

  return (
    <RecordsContainer>
      {!applicantEmail ? (
        <>
          <PageHeader>
            <h1>Check Application Status</h1>
            <p>Enter your email to view your submitted burial records.</p>
          </PageHeader>
          <EntryContainer>
            <EntryCard>
              <MdEmail size={48} color={theme.colors.primarySolid} style={{ marginBottom: 16 }} />
              <h2>Verify Identity</h2>
              <p>To protect privacy, please enter the email address used during the application process.</p>
              <form onSubmit={handleEmailSubmit}>
                <FormGroup style={{ textAlign: 'left', marginBottom: 24 }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    autoFocus
                  />
                </FormGroup>
                <Button $variant="primary" type="submit" style={{ width: '100%' }}>
                  View Records
                </Button>
              </form>
            </EntryCard>
          </EntryContainer>
        </>
      ) : (
        <>
          <PageHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <h1>My Records</h1>
                <p>Showing records submitted using the applicant’s email <strong>{applicantEmail}</strong></p>
              </div>
              <Button $variant="secondary" onClick={clearApplicantEmail} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdArrowBack /> Change Email
              </Button>
            </div>
          </PageHeader>

      {(records.length > 0 || filters.status || filters.deceasedName) && (
      <FilterSection>
        <h3>Filter Records</h3>
        <FiltersGrid>

          <FormGroup>
            <label>Search by Deceased Name</label>
            <input
              type="text"
              name="deceasedName"
              placeholder="Enter Deceased Name"
              value={filters.deceasedName}
              onChange={handleFilterChange}
            />
          </FormGroup>
          <FormGroup>
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="Pending">Pending Verification</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </FormGroup>
        </FiltersGrid>
        <FilterButtons>
          <Button $variant="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button $variant="secondary" onClick={resetFilters}>
            Reset
          </Button>
        </FilterButtons>
      </FilterSection>
      )}

      {loading ? (
        <TableSkeleton rows={6} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={<MdDescription size={48} />}
          title="No Records Found"
          description={
            filters.status || filters.deceasedName
              ? "No public records match your current filters. Try adjusting your search criteria."
              : "No records found for this email. You can submit a new burial record application."
          }
          action={
            filters.status || filters.deceasedName
              ? resetFilters
              : () => navigate('/data-capture')
          }
          actionText={
            filters.status || filters.deceasedName
              ? "Clear Filters"
              : "Create New Record"
          }
        />
      ) : (
        <>
          <RecordsGrid>
            {records.map(record => (
              <RecordCard key={record._id}>
                <CardHeader>
                  <div>
                    <RecordNumber>{record.recordNumber}</RecordNumber>
                  </div>
                  <StatusBadge $status={record.status}>
                    {(record.status === 'Pending' || !record.status) ? 'Pending Verification' : record.status}
                  </StatusBadge>
                </CardHeader>

                <CardBody>
                  <InfoRow>
                    <MdPerson className="icon" size={18} />
                    <div className="label">Name</div>
                    <div className="value">
                      {`${record.firstName || ''} ${record.lastName || ''}`.trim() || 'N/A'}
                    </div>
                  </InfoRow>

                  <InfoRow>
                    <MdCalendarToday className="icon" size={18} />
                    <div className="label">Date of Death</div>
                    <div className="value">{formatDate(record.dateOfDeath)}</div>
                  </InfoRow>

                  <InfoRow>
                    <MdCalendarToday className="icon" size={18} />
                    <div className="label">Date of Burial</div>
                    <div className="value">{formatDate(record.dateOfBurial)}</div>
                  </InfoRow>

                  <InfoRow>
                    <MdLocationOn className="icon" size={18} />
                    <div className="label">Location</div>
                    <div className="value">{record.burialLocation || 'N/A'}</div>
                  </InfoRow>

                  <InfoRow>
                    <MdCheckCircle className="icon" size={18} />
                    <div className="label">Submitted</div>
                    <div className="value">{formatDate(record.createdAt)}</div>
                  </InfoRow>

                  {record.status === 'Rejected' && record.rejectionReason && (
                    <RejectionInfo>
                      <MdErrorOutline className="icon" size={16} />
                      <div>
                        <strong>Rejected Reason : </strong>
                        {record.rejectionReason}
                      </div>
                    </RejectionInfo>
                  )}
                </CardBody>

                <CardFooter>
                  <DownloadButton
                    $variant="primary"
                    onClick={() => handleDownloadReceipt(record)}
                  >
                    <MdDownload size={18} />
                    Download Receipt
                  </DownloadButton>
                </CardFooter>
              </RecordCard>
            ))}
          </RecordsGrid>

          {records.length > 0 && pagination.totalPages > 1 && (
            <Pagination>
              <button
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
              >
                « Previous
              </button>
              <button className="active">{pagination.currentPage}</button>
              {pagination.currentPage < pagination.totalPages - 1 && <span>...</span>}
              {pagination.currentPage < pagination.totalPages && (
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.totalPages })}
                >
                  {pagination.totalPages}
                </button>
              )}
              <button
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next »
              </button>
            </Pagination>
          )}
        </>
      )}


        </>
      )}

      <div style={{ textAlign: 'center', padding: '24px', color: theme.colors.gray500, fontSize: '12px' }}>
        © 2025 Burial Record Manager. All rights reserved.
      </div>
    </RecordsContainer>
  );
}

export default Records;
