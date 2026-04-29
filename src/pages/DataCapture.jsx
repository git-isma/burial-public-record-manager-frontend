import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiService from "../utils/api";
import { uploadMultipleToS3 } from "../utils/uploadToS3";
import { generateAcknowledgementPDF } from "../utils/acknowledgementGenerator";
import { COUNTRIES } from "../utils/constants";
import styled from "styled-components";
import {
  Card,
  Button,
  FormGroup,
  FormGrid,
  PageHeader,
  theme,
} from "../styles/CommonStyles";
import ModernDatePicker from "../components/ModernDatePicker";
import { useToast } from "../contexts/ToastContext";
import { useSettings } from "../contexts/SettingsContext";
import {
  MdArrowBack,
  MdSave,
  MdAssignment,
  MdPerson,
  MdAttachFile,
  MdInfoOutline,
  MdFolder,
  MdCheckCircle,
  MdSchedule,
  MdVerified,
  MdRefresh,
  MdWarning,
  MdCheckCircleOutline,
  MdCancel,
  MdQrCode2,
} from "react-icons/md";
import { InlineSpinner } from "../components/Spinner";
import Tooltip from "../components/Tooltip";
import Modal from "../components/Modal";
import paymentQrUrl from "../assets/payment-qr.jpeg";

const SectionTitle = styled.h3`
  margin-top: ${(props) => (props.$first ? "0" : theme.spacing.xl)};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.gray200};

  body.dark-theme & {
    color: #e5e5e5;
    border-bottom-color: #3d3d3d;
  }

  span {
    font-size: 24px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: ${theme.spacing.lg};
  }

  label {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border: 2px solid ${theme.colors.gray200};
    border-radius: ${theme.borderRadius.lg};
    cursor: pointer;
    transition: all ${theme.transitions.base};
    font-weight: 500;
    background: white;
    flex: 1;
    min-width: 0;
    min-height: 44px;
    touch-action: manipulation;

    @media (min-width: 640px) {
      flex: auto;
    }

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    input {
      width: auto;
      margin: 0;
      cursor: pointer;
      flex-shrink: 0;
      min-width: 20px;
      min-height: 20px;
    }

    &:hover {
      border-color: ${theme.colors.primarySolid};
      background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);

      body.dark-theme & {
        background: #353535;
        border-color: #7c3aed;
      }
    }

    input:checked + & {
      border-color: ${theme.colors.primarySolid};
      background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);

      body.dark-theme & {
        background: #3d2d5d;
        border-color: #7c3aed;
      }
    }
  }
`;

const FileUploadArea = styled.div`
  border: 3px dashed ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  text-align: center;
  transition: all ${theme.transitions.base};
  background: ${theme.colors.gray50};
  cursor: pointer;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl};
    min-height: 140px;
  }

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
  }

  &:hover {
    border-color: ${theme.colors.primarySolid};
    background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);

    body.dark-theme & {
      background: #353535;
      border-color: #7c3aed;
    }
  }

  .icon {
    font-size: 40px;
    margin-bottom: ${theme.spacing.md};
    flex-shrink: 0;

    @media (min-width: 768px) {
      font-size: 48px;
    }
  }

  p {
    color: ${theme.colors.gray600};
    font-size: 13px;
    margin: ${theme.spacing.sm} 0;
    word-break: break-word;

    body.dark-theme & {
      color: #b0b0b0;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }

  input[type="file"] {
    display: none;
  }
`;

const FileInfo = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.success};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  body.dark-theme & {
    background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
    color: #6ee7b7;
  }

  svg {
    margin-right: 8px;
  }
`;

const ExistingAttachmentsSection = styled.div`
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray200};

  body.dark-theme & {
    background: #1f1f1f;
    border-color: #3d3d3d;
  }

  h4 {
    margin: 0 0 ${theme.spacing.md} 0;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.gray900};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const AttachmentsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AttachmentItem = styled.a`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: white;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  text-decoration: none;
  transition: all ${theme.transitions.base};
  cursor: pointer;
  min-height: 60px;

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
  }

  &:hover {
    border-color: ${theme.colors.primarySolid};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);

    body.dark-theme & {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border-color: #7c3aed;
    }
  }

  .file-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .file-info {
    flex: 1;
    min-width: 0;

    .file-name {
      font-size: 13px;
      font-weight: 600;
      color: ${theme.colors.gray900};
      margin: 0 0 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      body.dark-theme & {
        color: #e5e5e5;
      }
    }

    .file-date {
      font-size: 11px;
      color: ${theme.colors.gray500};
      margin: 0;

      body.dark-theme & {
        color: #a0a0a0;
      }
    }
  }

  .download-icon {
    font-size: 18px;
    color: ${theme.colors.primarySolid};
    flex-shrink: 0;
    transition: all ${theme.transitions.fast};

    body.dark-theme & {
      color: #a78bfa;
    }
  }

  &:hover .download-icon {
    transform: scale(1.2);
  }
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: ${theme.spacing.xs};
  color: #6b7280;
  cursor: help;
  transition: all ${theme.transitions.base};
  opacity: 0.7;

  body.dark-theme & {
    color: #9ca3af;
  }

  &:hover {
    color: #3D2F2F;
    opacity: 1;
    transform: scale(1.15);

    body.dark-theme & {
      color: #60a5fa;
    }
  }
`;

const HelperText = styled.p`
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  display: flex;
  align-items: center;

  body.dark-theme & {
    color: #9ca3af;
  }

  svg {
    flex-shrink: 0;
  }
`;

const AttachmentNote = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: ${theme.borderRadius.md};
  display: flex;
  gap: ${theme.spacing.md};

  body.dark-theme & {
    background: #78350f;
    border-left-color: #f59e0b;
  }

  .icon {
    flex-shrink: 0;
    color: #d97706;
    font-size: 20px;

    body.dark-theme & {
      color: #fbbf24;
    }
  }

  .content {
    flex: 1;

    h4 {
      margin: 0 0 6px 0;
      font-size: 13px;
      font-weight: 600;
      color: #92400e;

      body.dark-theme & {
        color: #fcd34d;
      }
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #b45309;
      line-height: 1.5;

      body.dark-theme & {
        color: #fde68a;
      }
    }

    ul {
      margin: 6px 0 0 0;
      padding-left: 20px;
      font-size: 12px;
      color: #b45309;

      body.dark-theme & {
        color: #fde68a;
      }

      li {
        margin: 4px 0;
      }
    }
  }
`;

const ExemptionNote = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background: #d1fae5;
  border-left: 4px solid #10b981;
  border-radius: ${theme.borderRadius.md};
  display: flex;
  gap: ${theme.spacing.md};

  body.dark-theme & {
    background: #064e3b;
    border-left-color: #10b981;
  }

  .icon {
    flex-shrink: 0;
    color: #059669;
    font-size: 20px;

    body.dark-theme & {
      color: #6ee7b7;
    }
  }

  .content {
    flex: 1;

    h4 {
      margin: 0 0 6px 0;
      font-size: 13px;
      font-weight: 600;
      color: #065f46;

      body.dark-theme & {
        color: #a7f3d0;
      }
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #047857;
      line-height: 1.5;

      body.dark-theme & {
        color: #86efac;
      }
    }
  }
`;

const TermsSection = styled.div`
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray200};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};

  body.dark-theme & {
    background: #1f1f1f;
    border-color: #3d3d3d;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-top: 3px;
    cursor: pointer;
    accent-color: ${theme.colors.primarySolid};
  }

  label {
    font-size: 14px;
    color: ${theme.colors.textPrimary};
    line-height: 1.5;
    cursor: pointer;

    body.dark-theme & {
      color: #e5e5e5;
    }

    strong {
      color: ${theme.colors.primarySolid};
    }
  }
`;

const SubmitSection = styled.div`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.xl};
  border-top: 2px solid ${theme.colors.gray200};
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  body.dark-theme & {
    border-top-color: #3d3d3d;
  }

  button {
    width: 100%;

    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const AutoSaveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${theme.colors.gray500};
  margin-left: auto;

  body.dark-theme & {
    color: #a0a0a0;
  }

  &.saving {
    color: ${theme.colors.warning};
  }

  &.saved {
    color: ${theme.colors.success};
  }

  svg {
    animation: ${(props) =>
    props.$saving ? "spin 1s linear infinite" : "none"};
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

function DataCapture() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");
  const { success, error } = useToast();
  const { settings } = useSettings();

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to generate next applicant ID
  // Helper function to generate next applicant ID
  const generateNextApplicantId = (latestId) => {
    const currentYear = new Date().getFullYear();

    if (!latestId) {
      // First ID of the year
      return `APP-${currentYear}-0001`;
    }

    // Parse the latest ID to extract the number
    const parts = latestId.split("-");
    const latestYear = parseInt(parts[1], 10);
    const latestNumber = parseInt(parts[2], 10);

    if (latestYear === currentYear) {
      // Same year, increment the number
      const nextNumber = latestNumber + 1;
      const result = `APP-${currentYear}-${String(nextNumber).padStart(5, "0")}`;
      console.log(`Incrementing ${latestId} to ${result}`);
      return result;
    } else {
      // New year, start from 0001
      return `APP-${currentYear}-0001`;
    }
  };

  // Helper function to generate next receipt number
  const generateNextReceiptNo = (latestReceiptNo) => {
    const currentYear = new Date().getFullYear();

    if (!latestReceiptNo) {
      // First receipt number of the year
      return `TRCP-${currentYear}-0001`;
    }

    // Parse the latest receipt number to extract the number
    const parts = latestReceiptNo.split("-");
    const latestYear = parseInt(parts[1], 10);
    const latestNumber = parseInt(parts[2], 10);

    if (latestYear === currentYear) {
      // Same year, increment the number
      const nextNumber = latestNumber + 1;
      return `TRCP-${currentYear}-${String(nextNumber).padStart(5, "0")}`;
    } else {
      // New year, start from 0001
      return `TRCP-${currentYear}-0001`;
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idPassportNo: "",
    gender: "Male",
    age: "",
    ageCategory: "",
    nationality: "",
    dateOfDeath: getTodayDate(),
    dateOfBurial: getTodayDate(),
    applicantId: "",
    applicantName: "",
    applicantIdPassportNo: "",
    applicantEmail: "",
    applicantPhone: "",
    nextOfKinName: "",
    nextOfKinRelationship: "",
    nextOfKinContact: "",
    nextOfKinIdPassport: "",
    burialLocation: "",
    burialTime: "",
    primaryService: "Burial",
    amountPayableBurial: "",
    amountToPayNow: "",
    secondaryService: "None",
    amountPayableSecondary: 0,
    tertiaryService: "None",
    amountPayableTertiary: 0,
    mpesaRefNo: "",
    tempReceiptNo: "",
    burialPermitNumber: "",
    burialPermitDate: getTodayDate(),
    burialPermitIssuedBy: "",
    burialPermitIssuedByContact: "",
    burialPermitIssuedTo: "",
    burialPermitIssuedToContact: "",
    status: "Verification Pending",
    rejectionReason: "",
    termsAccepted: false,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // '', 'saving', 'saved'
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [showQRPreview, setShowQRPreview] = useState(false);
  const [locations, setLocations] = useState([]);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocData = async () => {
      try {
        const locRes = await apiService.getLocations();
        setLocations(locRes.data || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocData();
  }, []);

  const refreshApplicantId = async () => {
    try {
      const res = await apiService.getLatestApplicantId();
      const nextId = res.data?.applicantId || res.data?.data?.applicantId;

      if (nextId) {
        setFormData((prev) => ({ ...prev, applicantId: nextId }));
      } else {
        const fallbackId = generateNextApplicantId(null);
        setFormData((prev) => ({ ...prev, applicantId: fallbackId }));
      }
      success("Applicant ID refreshed");
    } catch (err) {
      console.error("Error refreshing Applicant ID:", err);
      const fallbackId = generateNextApplicantId(null);
      setFormData((prev) => ({ ...prev, applicantId: fallbackId }));
    }
  };

  const refreshReceiptNo = async () => {
    try {
      const res = await apiService.getLatestReceiptNo();
      const nextNo = res.data?.tempReceiptNo || res.data?.receiptNo || res.data?.data?.tempReceiptNo || res.data?.data?.receiptNo;

      if (nextNo) {
        setFormData((prev) => ({ ...prev, tempReceiptNo: nextNo }));
      } else {
        const fallbackNo = generateNextReceiptNo(null);
        setFormData((prev) => ({ ...prev, tempReceiptNo: fallbackNo }));
      }
      success("Receipt Number refreshed");
    } catch (err) {
      console.error("Error refreshing Receipt No:", err);
      const fallbackNo = generateNextReceiptNo(null);
      setFormData((prev) => ({ ...prev, tempReceiptNo: fallbackNo }));
    }
  };

  // Fetch latest applicant ID and receipt number, then generate new ones
  const fetchAndGenerateIds = async () => {
    try {
      const [appIdRes, receiptNoRes] = await Promise.all([
        apiService.getLatestApplicantId(),
        apiService.getLatestReceiptNo(),
      ]);

      const nextId = appIdRes.data?.applicantId || appIdRes.data?.data?.applicantId;
      const nextReceiptNo = receiptNoRes.data?.tempReceiptNo || receiptNoRes.data?.receiptNo || receiptNoRes.data?.data?.tempReceiptNo || receiptNoRes.data?.data?.receiptNo;

      setFormData((prev) => ({
        ...prev,
        applicantId: nextId || generateNextApplicantId(null),
        tempReceiptNo: nextReceiptNo || generateNextReceiptNo(null),
      }));
    } catch (err) {
      console.error("Error fetching latest IDs:", err);
      setFormData((prev) => ({
        ...prev,
        applicantId: generateNextApplicantId(null),
        tempReceiptNo: generateNextReceiptNo(null),
      }));
    }
  };

  // Load draft from localStorage on mount (only for new records and if auto-save is enabled)
  useEffect(() => {
    if (!editId) {
      // Clear any existing draft to start fresh
      localStorage.removeItem("recordDraft");
      // Set dateOfDeath to today's date for new records
      setFormData((prev) => ({
        ...prev,
        dateOfDeath: getTodayDate(),
        dateOfBurial: getTodayDate(),
        burialPermitDate: getTodayDate(),
      }));

      fetchAndGenerateIds();
    } else {
      fetchRecordData(editId);
    }
  }, [editId]);

  // Auto-save to localStorage when form data changes
  useEffect(() => {
    if (
      !editId &&
      settings.autoSave &&
      (formData.firstName || formData.lastName)
    ) {
      setAutoSaveStatus("saving");

      const timer = setTimeout(() => {
        try {
          localStorage.setItem("recordDraft", JSON.stringify(formData));
          setAutoSaveStatus("saved");

          // Clear saved status after 2 seconds
          setTimeout(() => setAutoSaveStatus(""), 2000);
        } catch (err) {
          console.error("Error saving draft:", err);
          setAutoSaveStatus("");
        }
      }, 1500); // Save after 1.5 seconds of no typing

      return () => clearTimeout(timer);
    }
  }, [formData, editId, settings.autoSave]);

  const fetchRecordData = async (id) => {
    try {
      const res = await apiService.getRecordPublic(id);
      let record = res.data.success ? res.data.data[0] : res.data;

      if (!record) {
        error("Record not found");
        navigate("/records");
        return;
      }

      console.log("Fetched record for edit (public):", record);

      // Normalize nationality for dropdown matching
      let normalizedNationality = record.nationality || "";
      const nLower = normalizedNationality.toLowerCase().trim();
      if (nLower === "kenyan") normalizedNationality = "Kenya";
      else if (nLower === "ugandan") normalizedNationality = "Uganda";
      else if (nLower === "tanzanian") normalizedNationality = "Tanzania";
      else if (nLower === "ethiopian") normalizedNationality = "Ethiopia";
      else if (nLower === "somali") normalizedNationality = "Somalia";

      // When editing, always set status to "Verification Pending" for resubmission
      const editStatus = "Verification Pending";

      setFormData({
        firstName: record.firstName || "",
        middleName: record.middleName || "",
        lastName: record.lastName || "",
        idPassportNo: record.idPassportNo || "",
        gender: record.gender || "Male",
        age: (record.age !== undefined && record.age !== null) ? record.age : (record.ageCategory === 'Stillborn' ? 0 : record.ageCategory === 'Infant' ? 1 : ""),
        ageCategory: record.ageCategory || "",
        nationality: normalizedNationality,
        dateOfDeath: record.dateOfDeath ? record.dateOfDeath.split("T")[0] : "",
        dateOfBurial: record.dateOfBurial ? record.dateOfBurial.split("T")[0] : "",
        applicantId: record.applicantId || generateNextApplicantId(null),
        applicantName: record.applicantName || "",
        applicantIdPassportNo: record.applicantIdPassportNo || "",
        applicantEmail: record.applicantEmail || "",
        applicantPhone: record.applicantPhone || "",
        nextOfKinName: record.nextOfKinName || "",
        nextOfKinRelationship: record.nextOfKinRelationship || "",
        nextOfKinContact: record.nextOfKinContact || "",
        nextOfKinIdPassport: record.nextOfKinIdPassport || "",
        burialLocation: record.burialLocation || "",
        burialTime: record.burialTime || "",
        primaryService: record.primaryService || "Burial",
        amountPayableBurial: (record.amountPayableBurial !== undefined && record.amountPayableBurial !== null) ? record.amountPayableBurial : "",
        amountToPayNow: (record.amountToPayNow !== undefined && record.amountToPayNow !== null) ? record.amountToPayNow : ((record.amountPayableBurial !== undefined && record.amountPayableBurial !== null) ? record.amountPayableBurial : ""),
        secondaryService: record.secondaryService || "None",
        amountPayableSecondary: (record.amountPayableSecondary !== undefined && record.amountPayableSecondary !== null) ? record.amountPayableSecondary : 0,
        tertiaryService: record.tertiaryService || "None",
        amountPayableTertiary: (record.amountPayableTertiary !== undefined && record.amountPayableTertiary !== null) ? record.amountPayableTertiary : 0,
        mpesaRefNo: record.mpesaRefNo || "",
        tempReceiptNo: record.tempReceiptNo || "",
        burialPermitNumber: record.burialPermitNumber || "",
        burialPermitDate: record.burialPermitDate ? record.burialPermitDate.split("T")[0] : "",
        burialPermitIssuedBy: record.burialPermitIssuedBy || "",
        burialPermitIssuedByContact: record.burialPermitIssuedByContact || "",
        burialPermitIssuedTo: record.burialPermitIssuedTo || "",
        burialPermitIssuedToContact: record.burialPermitIssuedToContact || "",
        status: editStatus, // Always set to "Verification Pending" when editing
        rejectionReason: record.rejectionReason || "",
      });

      // Load existing attachments
      if (record.attachments && Array.isArray(record.attachments)) {
        setExistingAttachments(record.attachments);
        console.log("📎 Loaded existing attachments:", record.attachments);
      }
    } catch (err) {
      error("Error loading record data");
      console.error(err);
    }
  };

  const validateAge = (age, ageCategory) => {
    if (!age || age === "") {
      return { valid: true, message: "" };
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0) {
      return { valid: false, message: "Age must be a valid positive number" };
    }

    switch (ageCategory) {
      case "Stillborn":
        if (ageNum !== 0) {
          return { valid: false, message: "Age for Stillborn must be 0" };
        }
        break;
      case "Infant":
        if (ageNum < 0 || ageNum > 1) {
          return {
            valid: false,
            message: "Age for Infant must be between 0-1 years",
          };
        }
        break;
      case "Child":
        if (ageNum < 1 || ageNum > 12) {
          return {
            valid: false,
            message: "Age for Child must be between 1-12 years",
          };
        }
        break;
      case "Adult":
        if (ageNum <= 12) {
          return {
            valid: false,
            message: "Age for Adult must be above 12 years",
          };
        }
        break;
      default:
        return { valid: true, message: "" };
    }

    return { valid: true, message: "" };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateMpesaRef = (ref) => {
    const mpesaRegex = /^[A-Z0-9]{10}$/i;
    return mpesaRegex.test(ref);
  };

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };

    // Auto-set age for specific categories
    if (e.target.name === "ageCategory") {
      if (e.target.value === "Infant") {
        newFormData.age = "1";
        newFormData.amountPayableBurial = "4000";
        newFormData.amountToPayNow = "4000";
      } else if (e.target.value === "Stillborn") {
        newFormData.age = "0";
        newFormData.amountPayableBurial = "4000";
        newFormData.amountToPayNow = "4000";
      }
    }

    // Auto-calculate burial amount when location or time changes
    if (e.target.name === "burialLocation" || e.target.name === "burialTime") {
      const locationName = e.target.name === "burialLocation" ? e.target.value : formData.burialLocation;
      const burialTime = e.target.name === "burialTime" ? e.target.value : formData.burialTime;

      if (locationName && burialTime) {
        let amount = 0;

        if (newFormData.ageCategory === "Stillborn" || newFormData.ageCategory === "Infant") {
          amount = 4000;
        } else {
          // Try to get from dynamic location data fetched from API
          const loc = locations.find(l => (typeof l === 'string' ? l === locationName : l.name === locationName));
          if (loc && typeof loc === 'object') {
            amount = burialTime === "Daytime" ? (loc.daytimePrice || 0) : (loc.nighttimePrice || 0);
          }
        }

        newFormData.amountPayableBurial = amount.toString();
        newFormData.amountToPayNow = amount.toString();
      }
    }

    setFormData(newFormData);

    // Validate age when age category changes
    if (e.target.name === "ageCategory" && newFormData.age) {
      const ageValidation = validateAge(newFormData.age, e.target.value);
      if (!ageValidation.valid) {
        error(ageValidation.message);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveExistingAttachment = (indexToRemove) => {
    setExistingAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      error("Please accept the terms and conditions before saving the record.");
      return;
    }

    // Validate email
    if (formData.applicantEmail && !validateEmail(formData.applicantEmail)) {
      error("Please enter a valid email address");
      return;
    }

    // Validate applicant phone
    if (formData.applicantPhone && !validatePhone(formData.applicantPhone)) {
      error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    // Validate next of kin phone
    if (formData.nextOfKinContact && !validatePhone(formData.nextOfKinContact)) {
      error("Please enter a valid next of kin phone number (at least 10 digits)");
      return;
    }

    // Validate M-Pesa reference if provided
    if (formData.mpesaRefNo && !validateMpesaRef(formData.mpesaRefNo)) {
      error("M-Pesa reference must be exactly 10 alphanumeric characters (e.g., ABC1234567)");
      return;
    }

    // Validate amount to pay now
    const amountToPay = parseFloat(formData.amountToPayNow || 0);
    const amountPayable = parseFloat(formData.amountPayableBurial || 0);
    if (amountToPay > amountPayable) {
      error("Amount to Pay Now cannot exceed Amount Payable for Burial");
      return;
    }

    // Validate Date of Death is not in the future
    if (formData.dateOfDeath) {
      const dod = new Date(formData.dateOfDeath);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (dod > today) {
        error("Date of Death cannot be in the future");
        return;
      }

      // Check date of burial vs date of death
      if (formData.dateOfBurial) {
        const dobArr = formData.dateOfBurial.split('-');
        const dob = new Date(dobArr[0], dobArr[1] - 1, dobArr[2]);
        const dodOnly = new Date(dod);
        dodOnly.setHours(0, 0, 0, 0);
        const dobOnly = new Date(dob);
        dobOnly.setHours(0, 0, 0, 0);

        if (dobOnly < dodOnly) {
          error("Date of Burial cannot be earlier than Date of Death");
          return;
        }
      }
    }

    // Validate required fields for deceased
    if (!formData.age && formData.age !== 0) {
      error("Age is required");
      return;
    }
    if (!formData.gender) {
      error("Gender is required");
      return;
    }
    if (!formData.nationality) {
      error("Nationality is required");
      return;
    }

    // Validate age based on age category
    // Validate age based on age category
    if (formData.ageCategory && formData.age !== "") {
      const age = parseInt(formData.age, 10);

      if (isNaN(age) || age < 0) {
        error("Age must be a valid positive number");
        return;
      }

      switch (formData.ageCategory) {
        case "Stillborn":
          // Stillborn typically has age 0 or no age
          if (age > 0) {
            error("Stillborn age should be 0");
            return;
          }
          break;
        case "Infant":
          // Infant: 0-1 years (inclusive)
          if (age > 1) {
            error("Infant age must be between 0 and 1 year");
            return;
          }
          break;
        case "Child":
          // Child: 1-12 years (inclusive)
          if (age < 1 || age > 12) {
            error("Child age must be between 1 and 12 years");
            return;
          }
          break;
        case "Adult":
          // Adult: Above 12 years (12+)
          if (age <= 12) {
            error("Adult age must be above 12 years");
            return;
          }
          break;
        default:
          break;
      }
    }

    // Validate burial location and time are selected
    if (!formData.burialLocation) {
      error("Please select a burial location");
      return;
    }

    if (!formData.burialTime) {
      error("Please select the time of burial");
      return;
    }

    if (!formData.amountPayableBurial) {
      error("Amount Payable for Burial is required");
      return;
    }

    // Validate attachments are required
    const totalAttachments = files.length + existingAttachments.length;

    if (!editId) {
      if (formData.ageCategory === "Stillborn" && totalAttachments < 1) {
        error("Medical Certificate of Stillbirth is required for Stillborn category. Please upload it.");
        return;
      }
      if (formData.ageCategory === "Infant" && totalAttachments < 1) {
        error("Birth Certificate is required for Infant category. Please upload it.");
        return;
      }
      if (["Adult", "Child"].includes(formData.ageCategory) && totalAttachments < 1) {
        error("Attachments are required for this age category. Please upload at least one document.");
        return;
      }
    }

    setLoading(true);

    try {
      // Upload files to S3 if any
      let attachments = [];
      if (files.length > 0) {
        try {
          const uploadedUrls = await uploadMultipleToS3(
            files,
            "public-records",
            { applicantMobile: formData.applicantPhone }
          );
          console.log("✅ Files uploaded to S3:", uploadedUrls);

          // Format attachments as array of objects with filename and path
          attachments = files.map((file, index) => ({
            filename: file.name,
            path: uploadedUrls[index],
          }));
          console.log("📎 Formatted attachments:", attachments);
        } catch (uploadErr) {
          console.error("❌ Error uploading files:", uploadErr);
          error("Failed to upload attachments. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Prepare record data with formatted attachments
      // Filter out empty optional fields to avoid enum validation errors
      const recordData = {};
      const optionalFields = [
        "middleName",
        "mpesaRefNo",
      ];
      const excludedFields = ["recordNumber"]; // Exclude recordNumber from payload

      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        // Include field if it's not excluded, and if it's not optional, or if it's optional and has a value
        if (
          !excludedFields.includes(key) &&
          (!optionalFields.includes(key) || (value && value !== ""))
        ) {
          // Map "Verification Pending" to "Pending" for backend
          if (key === "status" && (value === "Verification Pending" || value === "Rejected")) {
            recordData[key] = "Pending";
          } else {
            recordData[key] = value;
          }
        }
      });

      // Map applicantPhone to applicantMobile for backend consistency if needed, 
      // but we updated models to use semantic names where possible.
      // Keeping applicantPhone mapping for now if backend expects applicantMobile.
      // Wait, let's check backend PublicRecord again. 
      // It has applicantPhone. So no need to map to applicantMobile!

      recordData.applicantPhone = formData.applicantPhone;
      recordData.attachments = [...existingAttachments, ...attachments]; // Ensure all attachments are included

      // Remove termsAccepted before sending to backend
      const { termsAccepted: _terms, ...dataToSubmit } = recordData;

      if (editId) {
        // Update existing record (public)
        await apiService.updateRecordPublic(editId, dataToSubmit);
        success("Burial record updated and resubmitted successfully!");
        navigate("/records");
      } else {
        // Create new record using public endpoint (no auth required)
        const res = await apiService.submitRecordPublic(dataToSubmit);
        const submittedRecord = res.data;
        success("Record submitted successfully! Your acknowledgement PDF is being generated...");

        // Generate and download acknowledgement PDF
        try {
          console.log(
            "📄 Generating acknowledgement PDF for:",
            submittedRecord.id || submittedRecord._id
          );
          // Merge submitted record with form data to ensure all details are included
          const recordWithDetails = {
            ...formData,
            ...submittedRecord,
            // Map field names for consistency
            amountPayableBurial: formData.amountPayableBurial || submittedRecord.amountPayableBurial,
            applicantIdPassport: formData.applicantIdPassportNo || submittedRecord.applicantIdPassport,
          };
          generateAcknowledgementPDF(recordWithDetails, settings.formatDate);
          // Acknowledgement PDF downloaded successfully
          console.log("Acknowledgement PDF generated successfully");
        } catch (pdfErr) {
          console.error("⚠️ Error generating acknowledgement PDF:", pdfErr);
          // Don't fail the submission if PDF generation fails
        }

        // Clear draft from localStorage after successful submission
        localStorage.removeItem("recordDraft");
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          idPassportNo: "",
          gender: "",
          age: "",
          ageCategory: "",
          nationality: "",
          dateOfDeath: getTodayDate(),
          dateOfBurial: getTodayDate(),
          applicantName: "",
          applicantIdPassportNo: "",
          applicantEmail: "",
          applicantPhone: "",
          nextOfKinName: "",
          nextOfKinRelationship: "",
          nextOfKinContact: "",
          nextOfKinIdPassport: "",
          burialLocation: "",
          burialTime: "",
          primaryService: "Burial",
          amountPayableBurial: "",
          amountToPayNow: "",
          secondaryService: "None",
          amountPayableSecondary: 0,
          tertiaryService: "None",
          amountPayableTertiary: 0,
          mpesaRefNo: "",
          tempReceiptNo: "",
          burialPermitNumber: "",
          burialPermitDate: getTodayDate(),
          burialPermitIssuedBy: "",
          burialPermitIssuedByContact: "",
          burialPermitIssuedTo: "",
          burialPermitIssuedToContact: "",
          status: "Verification Pending",
        });
        setFiles([]);
        setAutoSaveStatus("");
        // After successful submission, refresh IDs
        fetchAndGenerateIds();
      }
    } catch (err) {
      console.error("❌ Error in handleSubmit:", err);
      error(err.response?.data?.msg || err.message || "Error saving record");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Clear draft from localStorage
    localStorage.removeItem("recordDraft");

    // Fetch latest applicant ID and receipt number, then generate new ones
    const fetchAndGenerateId = async () => {
      try {
        const [appIdRes, receiptNoRes] = await Promise.all([
          apiService.getLatestApplicantId(),
          apiService.getLatestReceiptNo(),
        ]);

        const latestId = appIdRes.data?.data?.applicantId || appIdRes.data?.applicantId || appIdRes.data?.latestApplicantId || null;
        const latestReceiptNo = receiptNoRes.data?.data?.receiptNo || receiptNoRes.data?.receiptNo || receiptNoRes.data?.latestReceiptNo || null;

        const newApplicantId = generateNextApplicantId(latestId);
        const newReceiptNo = generateNextReceiptNo(latestReceiptNo);

        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          idPassportNo: "",
          gender: "",
          age: "",
          ageCategory: "",
          nationality: "",
          dateOfDeath: getTodayDate(),
          dateOfBurial: getTodayDate(),
          applicantId: newApplicantId,
          applicantName: "",
          applicantIdPassportNo: "",
          applicantEmail: "",
          applicantPhone: "",
          nextOfKinName: "",
          nextOfKinRelationship: "",
          nextOfKinContact: "",
          nextOfKinIdPassport: "",
          burialLocation: "",
          burialTime: "",
          primaryService: "Burial",
          amountPayableBurial: "",
          secondaryService: "None",
          amountPayableSecondary: 0,
          tertiaryService: "None",
          amountPayableTertiary: 0,
          mpesaRefNo: "",
          tempReceiptNo: newReceiptNo,
          burialPermitNumber: "",
          burialPermitDate: getTodayDate(),
          burialPermitIssuedBy: "",
          burialPermitIssuedByContact: "",
          burialPermitIssuedTo: "",
          burialPermitIssuedToContact: "",
          status: "Verification Pending",
        });
      } catch (err) {
        console.error("Error fetching latest IDs:", err);
        // Fallback: generate IDs starting from 0001
        const newApplicantId = generateNextApplicantId(null);
        const newReceiptNo = generateNextReceiptNo(null);
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          idPassportNo: "",
          gender: "",
          age: "",
          ageCategory: "",
          nationality: "",
          dateOfDeath: getTodayDate(),
          dateOfBurial: getTodayDate(),
          applicantId: newApplicantId,
          applicantName: "",
          applicantIdPassportNo: "",
          applicantEmail: "",
          applicantPhone: "",
          nextOfKinName: "",
          nextOfKinRelationship: "",
          nextOfKinContact: "",
          nextOfKinIdPassport: "",
          burialLocation: "",
          burialTime: "",
          primaryService: "Burial",
          amountPayableBurial: "",
          secondaryService: "None",
          amountPayableSecondary: 0,
          tertiaryService: "None",
          amountPayableTertiary: 0,
          mpesaRefNo: "",
          tempReceiptNo: newReceiptNo,
          burialPermitNumber: "",
          burialPermitDate: getTodayDate(),
          burialPermitIssuedBy: "",
          burialPermitIssuedByContact: "",
          burialPermitIssuedTo: "",
          burialPermitIssuedToContact: "",
          status: "Verification Pending",
        });
      }
    };

    fetchAndGenerateId();
    setFiles([]);
    setAutoSaveStatus("");
  };

  return (
    <div>
      <PageHeader>
        <div>
          <h1>{editId ? (formData.status === "Rejected" ? "Resubmit Record" : "Update Record") : "New Record"}</h1>
          <p>{editId ? (formData.status === "Rejected" ? "Correct rejected record and resubmit" : "Modify existing burial record") : "Create and register a new burial record"}</p>
        </div>
        {editId && (
          <Button $variant="secondary" onClick={() => navigate("/records")}>
            <MdArrowBack size={18} /> Back to Records
          </Button>
        )}
      </PageHeader>

      {editId && formData.status === "Rejected" && (
        <Card style={{ borderLeft: "4px solid " + theme.colors.danger, marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <MdWarning size={24} color={theme.colors.danger} style={{ marginTop: "2px" }} />
            <div>
              <h3 style={{ margin: "0 0 8px 0", color: theme.colors.danger }}>Application Rejected</h3>
              <p style={{ margin: 0, fontSize: "15px", color: theme.colors.gray700 }}>
                <strong>Rejection Reason:</strong> {formData.rejectionReason}
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: theme.colors.gray600 }}>
                Please correct the information below and resubmit your application for verification.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <SectionTitle $first>
            <span className="section-icon">
              <MdPerson />
            </span>
            Applicant Information
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Applicant ID</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  value={formData.applicantId}
                  readOnly
                  placeholder="Auto-generated"
                  style={{
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed",
                    color: theme.colors.primarySolid,
                    fontWeight: "700",
                    fontSize: "16px",
                    flex: 1,
                  }}
                />
                <Button
                  type="button"
                  onClick={refreshApplicantId}
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                  }}
                  title="Refresh Applicant ID"
                >
                  <MdRefresh size={18} />
                </Button>
              </div>
              <HelperText>
                <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                Auto-generated unique identifier
              </HelperText>
            </FormGroup>
            <FormGroup>
              <label>Applicant Name *</label>
              <input
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                placeholder="Enter applicant name"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>ID / Passport No *</label>
              <input
                name="applicantIdPassportNo"
                value={formData.applicantIdPassportNo}
                onChange={handleChange}
                placeholder="Enter ID or Passport number"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Applicant Email *</label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                placeholder="Enter applicant email"
                disabled={!!editId}
                style={editId ? { backgroundColor: "#f3f4f6", cursor: "not-allowed", opacity: 0.7 } : {}}
                required
              />
              {editId && (
                <HelperText>
                  <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                  Email cannot be changed during edit
                </HelperText>
              )}
            </FormGroup>
            <FormGroup>
              <label>Applicant Mobile No *</label>
              <input
                type="tel"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
                placeholder="e.g., 0712345678"
                required
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdPerson />
            </span>
            Deceased Information
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Age Category *</label>
              <select
                name="ageCategory"
                value={formData.ageCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Age Category</option>
                <option value="Stillborn">Stillborn</option>
                <option value="Infant">Infant (0–1 year)</option>
                <option value="Child">Child (1–12 years)</option>
                <option value="Adult">Adult (Above 12 years)</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>
                First Name{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>Middle Name</label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
              />
            </FormGroup>
            <FormGroup>
              <label>
                Last Name{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>
                ID / Passport No{" "}
                {formData.ageCategory === "Adult"
                  ? "*"
                  : ""}
              </label>
              <input
                name="idPassportNo"
                value={formData.idPassportNo}
                onChange={handleChange}
                placeholder={["Stillborn", "Infant", "Child"].includes(formData.ageCategory) ? "Not required" : "Enter ID or Passport number"}
                disabled={["Stillborn", "Infant", "Child"].includes(formData.ageCategory)}
                style={["Stillborn", "Infant", "Child"].includes(formData.ageCategory) ? { backgroundColor: "#f3f4f6", opacity: 0.6, cursor: "not-allowed" } : {}}
                required={formData.ageCategory === "Adult"}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Nationality *</label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              >
                <option value="">Select Nationality</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <label>
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={(e) => {
                  if (formData.ageCategory && e.target.value) {
                    const ageValidation = validateAge(
                      e.target.value,
                      formData.ageCategory
                    );
                    if (!ageValidation.valid) {
                      error(ageValidation.message);
                    }
                  }
                }}
                placeholder={
                  formData.ageCategory === "Stillborn"
                    ? "Enter 0"
                    : formData.ageCategory === "Infant"
                      ? "Enter 0-1"
                      : formData.ageCategory === "Child"
                        ? "Enter 1-12"
                        : formData.ageCategory === "Adult"
                          ? "Enter above 12"
                          : "Enter age"
                }
                min={
                  formData.ageCategory === "Stillborn"
                    ? 0
                    : formData.ageCategory === "Infant"
                      ? 0
                      : formData.ageCategory === "Child"
                        ? 1
                        : formData.ageCategory === "Adult"
                          ? 13
                          : 0
                }
                max={
                  formData.ageCategory === "Stillborn"
                    ? 0
                    : formData.ageCategory === "Infant"
                      ? 1
                      : formData.ageCategory === "Child"
                        ? 12
                        : undefined
                }
                disabled={formData.ageCategory === "Stillborn"}
                required={formData.ageCategory !== "Stillborn"}
              />
              {formData.ageCategory && (
                <HelperText>
                  <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                  {formData.ageCategory === "Stillborn"
                    ? "Age is automatically set to 0 for Stillborn"
                    : formData.ageCategory === "Infant"
                      ? "Age is automatically set to 1 for Infant"
                      : formData.ageCategory === "Child"
                        ? "Age must be between 1-12 years"
                        : formData.ageCategory === "Adult"
                          ? "Age must be above 12 years"
                          : ""}
                </HelperText>
              )}
            </FormGroup>
            <FormGroup>
              <label>Date of Death *</label>
              <ModernDatePicker
                value={formData.dateOfDeath}
                onChange={handleChange}
                name="dateOfDeath"
                placeholder="Pick date of death"
                maxDate={new Date()}
                required
              />
              <HelperText>
                <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                Future dates cannot be selected
              </HelperText>
            </FormGroup>
            <FormGroup>
              <label>Date of Burial *</label>
              <ModernDatePicker
                value={formData.dateOfBurial}
                onChange={handleChange}
                name="dateOfBurial"
                placeholder="Pick date of burial"
                required
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdPerson />
            </span>
            Next of Kin Information
            <Tooltip
              content="Closest relative to contact in emergency (spouse, parent, sibling, or adult child)"
              position="right"
              multiline={true}
              width="400px"
            >
              <InfoIcon>
                <MdInfoOutline size={18} />
              </InfoIcon>
            </Tooltip>
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Name of Next of Kin *</label>
              <input
                name="nextOfKinName"
                value={formData.nextOfKinName}
                onChange={handleChange}
                placeholder="Enter next of kin name"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Relationship with Deceased *</label>
              <select
                name="nextOfKinRelationship"
                value={formData.nextOfKinRelationship}
                onChange={handleChange}
                required
              >
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Next of Kin Contact *</label>
              <input
                type="tel"
                name="nextOfKinContact"
                value={formData.nextOfKinContact}
                onChange={handleChange}
                placeholder="e.g., 0712345678"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Next of Kin ID / Passport No *</label>
              <input
                name="nextOfKinIdPassport"
                value={formData.nextOfKinIdPassport}
                onChange={handleChange}
                placeholder="Enter ID or Passport number"
                required
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdAssignment />
            </span>
            Burial Permit Details (Government Issued)
          </SectionTitle>
          {(formData.ageCategory === "Stillborn" ||
            formData.ageCategory === "Infant") && (
              <HelperText style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#fef3c7", borderRadius: "6px", color: "#92400e" }}>
                <MdInfoOutline size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
                Burial permit details are not required for Stillborn and Infant cases. These fields are disabled.
              </HelperText>
            )}
          <FormGrid>
            <FormGroup>
              <label>
                Burial Permit Number{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                name="burialPermitNumber"
                value={formData.burialPermitNumber}
                onChange={handleChange}
                placeholder="Enter government burial permit number"
                disabled={
                  formData.ageCategory === "Stillborn" ||
                  formData.ageCategory === "Infant"
                }
                style={
                  formData.ageCategory === "Stillborn" ||
                    formData.ageCategory === "Infant"
                    ? {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                      color: "#9ca3af",
                    }
                    : {}
                }
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>
                Date of Burial Permit{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <ModernDatePicker
                value={formData.burialPermitDate}
                onChange={handleChange}
                name="burialPermitDate"
                placeholder="Pick date of permit issuance"
                disabled={
                  formData.ageCategory === "Stillborn" ||
                  formData.ageCategory === "Infant"
                }
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>
                Permit Issued By{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                name="burialPermitIssuedBy"
                value={formData.burialPermitIssuedBy}
                onChange={handleChange}
                placeholder="Name of authority"
                disabled={
                  formData.ageCategory === "Stillborn" ||
                  formData.ageCategory === "Infant"
                }
                style={
                  formData.ageCategory === "Stillborn" ||
                    formData.ageCategory === "Infant"
                    ? {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                      color: "#9ca3af",
                    }
                    : {}
                }
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>
                Issuer Contact Address{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                name="burialPermitIssuedByContact"
                value={formData.burialPermitIssuedByContact}
                onChange={handleChange}
                placeholder="Authority's office address"
                disabled={
                  formData.ageCategory === "Stillborn" ||
                  formData.ageCategory === "Infant"
                }
                style={
                  formData.ageCategory === "Stillborn" ||
                    formData.ageCategory === "Infant"
                    ? {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                      color: "#9ca3af",
                    }
                    : {}
                }
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>
                Permit Issued To{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                name="burialPermitIssuedTo"
                value={formData.burialPermitIssuedTo}
                onChange={handleChange}
                placeholder="Name of the person to whom permit was issued"
                disabled={
                  formData.ageCategory === "Stillborn" ||
                  formData.ageCategory === "Infant"
                }
                style={
                  formData.ageCategory === "Stillborn" ||
                    formData.ageCategory === "Infant"
                    ? {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                      color: "#9ca3af",
                    }
                    : {}
                }
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
            <FormGroup>
              <label>
                Recipient Contact Number{" "}
                {formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <input
                type="tel"
                name="burialPermitIssuedToContact"
                value={formData.burialPermitIssuedToContact}
                onChange={handleChange}
                placeholder="Contact number of the permit holder"
                disabled={
                  formData.ageCategory === "Stillborn" ||
                  formData.ageCategory === "Infant"
                }
                style={
                  formData.ageCategory === "Stillborn" ||
                    formData.ageCategory === "Infant"
                    ? {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                      color: "#9ca3af",
                    }
                    : {}
                }
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdAttachFile />
            </span>
            Burial Location & Services
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Location of Burial *</label>
              <select
                name="burialLocation"
                value={formData.burialLocation}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map((loc, idx) => {
                  const name = typeof loc === 'string' ? loc : loc.name;
                  const id = typeof loc === 'string' ? `loc-${idx}` : (loc._id || loc.id);
                  return (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </FormGroup>
            <FormGroup>
              <label>Time of Burial *</label>
              <select
                name="burialTime"
                value={formData.burialTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                <option value="Daytime">Daytime</option>
                <option value="Nighttime">Nighttime</option>
              </select>
              <HelperText>
                <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                Select daytime or nighttime burial
              </HelperText>
            </FormGroup>
            <FormGroup>
              <label>Primary Service *</label>
              <select
                name="primaryService"
                value={formData.primaryService}
                onChange={handleChange}
                required
              >
                <option value="">Select Service</option>
                <option value="Burial">Burial</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Amount Payable for Burial *</label>
              <input
                type="number"
                name="amountPayableBurial"
                value={formData.amountPayableBurial}
                readOnly
                placeholder="Auto-calculated"
                min="0"
                required
                style={{
                  backgroundColor: "#f3f4f6",
                  cursor: "not-allowed",
                  color: "#374151",
                  fontWeight: "600",
                  width: "100%"
                }}
              />
              <HelperText style={{ marginTop: "8px", alignItems: "flex-start" }}>
                <MdInfoOutline size={16} style={{ marginRight: "6px", flexShrink: 0, marginTop: "2px" }} />
                <span>Automatically calculated standard fee based on location and time.</span>
              </HelperText>
            </FormGroup>
            <FormGroup>
              <label>
                Actual Amount Paid *
                <Tooltip
                  content="Enter the actual amount being paid today. This defaults to the standard fee but can be lowered for committee-approved concessions or installments."
                  position="right"
                  multiline={true}
                  width="400px"
                >
                  <InfoIcon>
                    <MdInfoOutline size={18} />
                  </InfoIcon>
                </Tooltip>
              </label>
              <input
                type="number"
                name="amountToPayNow"
                value={formData.amountToPayNow}
                onChange={handleChange}
                placeholder="Enter amount to pay"
                min="0"
                required
              />
              <HelperText style={{ marginTop: "8px", alignItems: "flex-start" }}>
                <MdInfoOutline size={16} style={{ marginRight: "6px", flexShrink: 0, marginTop: "2px" }} />
                <span><strong>Please enter this exact amount manually</strong> upon redirection to Pesawise.</span>
              </HelperText>
            </FormGroup>

            <FormGroup>
              <div style={{ display: "flex", height: "100%", alignItems: "stretch", backgroundColor: "var(--bg-card)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color, #e5e7eb)", boxSizing: "border-box" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, paddingRight: "16px", justifyContent: "flex-start", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Pay via Link</span>
                  <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button
                      as="a"
                      href="https://payments.pesawise.com/link/lmaiundtro"
                      target="_blank"
                      rel="noopener noreferrer"
                      $variant="primary"
                      style={{
                        padding: "8px 16px",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        minHeight: "44px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "max-content"
                      }}
                    >
                      PAY HERE
                    </Button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1, borderLeft: "2px dashed var(--border-color, #d1d5db)", paddingLeft: "16px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Or Scan to Pay</span>
                  <div
                    onClick={() => setShowQRPreview(true)}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f9fafb", // dim background
                      border: "1px dashed #e5e7eb",
                      color: "#3D2F2F", // PAY HERE button color
                    }}
                  >
                    <MdQrCode2 size={48} />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary, #6b7280)", marginTop: "2px" }}>
                    Click to view QR Code
                  </span>
                </div>
              </div>
            </FormGroup>
            {/* 
            <FormGroup>
              <label>Secondary Service</label>
              <select
                name="secondaryService"
                value={formData.secondaryService}
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                <option value="None">None</option>
                <option value="Head stone">Head stone</option>
                <option value="Permanent grave">Permanent grave</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Amount Payable for Secondary Service</label>
              <input
                type="number"
                name="amountPayableSecondary"
                value={formData.amountPayableSecondary}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label>Other Services</label>
              <select
                name="tertiaryService"
                value={formData.tertiaryService}
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                <option value="None">None</option>
                <option value="Burial Record application">
                  Burial Record application
                </option>
                <option value="Donation">Donation</option>
                <option value="Others">Others</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Amount Payable for Other Services</label>
              <input
                type="number"
                name="amountPayableTertiary"
                value={formData.amountPayableTertiary}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
            */}
          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdAttachFile />
            </span>
            Payment Information
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>
                Mpesa Ref No.
                <Tooltip
                  content="M-Pesa is a mobile money service used mainly in Kenya and Tanzania that allows people to send, receive, and pay using their phones without a bank account. Must be exactly 10 alphanumeric characters."
                  position="right"
                  multiline={true}
                  width="450px"
                >
                  <InfoIcon>
                    <MdInfoOutline size={18} />
                  </InfoIcon>
                </Tooltip>
              </label>
              <input
                name="mpesaRefNo"
                value={formData.mpesaRefNo}
                onChange={handleChange}
                placeholder="e.g., ABC1234567 (10 characters)"
                maxLength="10"
              />
              <HelperText>
                <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                Exactly 10 alphanumeric characters (e.g., ABC1234567)
              </HelperText>
            </FormGroup>
            <FormGroup>
              <label>Temp Receipt No.</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  value={formData.tempReceiptNo}
                  readOnly
                  placeholder="Auto-generated"
                  style={{
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed",
                    color: theme.colors.primarySolid,
                    fontWeight: "700",
                    fontSize: "16px",
                    flex: 1,
                  }}
                />
                <Button
                  type="button"
                  onClick={refreshReceiptNo}
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                  }}
                  title="Refresh Receipt No"
                >
                  <MdRefresh size={18} />
                </Button>
              </div>
              <HelperText>
                <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                Auto-generated
              </HelperText>
            </FormGroup>

          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdAttachFile />
            </span>
            Attachments
          </SectionTitle>

          {formData.ageCategory === "Stillborn" ||
            formData.ageCategory === "Infant" ? (
            <AttachmentNote>
              <div className="icon">
                <MdWarning size={20} />
              </div>
              <div className="content">
                <h4>Required Documents *</h4>
                <p>
                  {formData.ageCategory === "Stillborn"
                    ? "Please upload the Medical Certificate of Stillbirth."
                    : "Please upload the Birth Certificate."}
                </p>
              </div>
            </AttachmentNote>
          ) : (
            <AttachmentNote>
              <div className="icon">
                <MdWarning size={20} />
              </div>
              <div className="content">
                <h4>Required Documents *</h4>
                <p>Please upload the following mandatory documents:</p>
                <ul>
                  <li>Burial Record Copy</li>
                  <li>ID Proof of Deceased Person</li>
                </ul>
              </div>
            </AttachmentNote>
          )}

          {/* Display existing attachments when editing */}
          {editId && existingAttachments.length > 0 && (
            <ExistingAttachmentsSection>
              <h4>
                <MdAttachFile size={18} />
                Existing Attachments ({existingAttachments.length})
              </h4>
              <AttachmentsList>
                {existingAttachments.map((attachment, index) => {
                  const uploadedDate = attachment.uploadedAt
                    ? new Date(attachment.uploadedAt).toLocaleDateString()
                    : "Unknown date";
                  const fileExtension = attachment.filename
                    .split(".")
                    .pop()
                    .toUpperCase();

                  // Determine file icon based on extension
                  let fileIcon = "📄";
                  if (fileExtension === "PDF") fileIcon = "📕";
                  else if (["JPG", "JPEG", "PNG"].includes(fileExtension))
                    fileIcon = "🖼️";

                  return (
                    <AttachmentItem
                      key={index}
                      href={attachment.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Download ${attachment.filename}`}
                    >
                      <div className="file-icon">{fileIcon}</div>
                      <div className="file-info">
                        <p className="file-name">{attachment.filename}</p>
                        <p className="file-date">Uploaded: {uploadedDate}</p>
                      </div>
                      <div className="download-icon">⬇️</div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveExistingAttachment(index);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContents: "center",
                          padding: "4px",
                          marginLeft: "8px",
                          zIndex: 2
                        }}
                        title="Remove existing attachment"
                      >
                        <MdCancel size={24} />
                      </button>
                    </AttachmentItem>
                  );
                })}
              </AttachmentsList>
            </ExistingAttachmentsSection>
          )}

          <FormGroup>
            <FileUploadArea
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div className="icon">
                <MdFolder size={48} />
              </div>
              <p>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p>PDF, JPG, PNG (Max 10MB)</p>
              <input
                id="fileInput"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </FileUploadArea>
            {files.length > 0 && (
              <ExistingAttachmentsSection style={{ marginTop: "16px", background: "transparent", border: "1px dashed var(--border-color, #cbd5e1)" }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MdAttachFile size={18} /> Selected Files - Ready to Upload ({files.length})
                </h4>
                <AttachmentsList>
                  {files.map((file, index) => {
                    const fileExtension = file.name.split(".").pop().toUpperCase();
                    let fileIcon = "📄";
                    if (fileExtension === "PDF") fileIcon = "📕";
                    else if (["JPG", "JPEG", "PNG"].includes(fileExtension)) fileIcon = "🖼️";

                    // Create an object URL for preview
                    const fileUrl = URL.createObjectURL(file);

                    return (
                      <AttachmentItem
                        key={index}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          // Allow the click to go through to open the link, but manage the URL cleanup later if needed
                        }}
                        style={{ cursor: "pointer" }}
                        title={`Preview ${file.name}`}
                      >
                        <div className="file-icon">{fileIcon}</div>
                        <div className="file-info">
                          <p className="file-name" title={file.name}>{file.name}</p>
                          <p className="file-date">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent opening the link when clicking remove
                            e.stopPropagation();
                            handleRemoveFile(index);
                            URL.revokeObjectURL(fileUrl); // Clean up memory
                          }}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}
                          title="Remove file"
                        >
                          <MdCancel size={24} />
                        </button>
                      </AttachmentItem>
                    );
                  })}
                </AttachmentsList>
              </ExistingAttachmentsSection>
            )}
          </FormGroup>

          <SectionTitle>
            <span className="section-icon">
              <MdCheckCircle />
            </span>
            Status
          </SectionTitle>
          <FormGroup>
            <RadioGroup>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Verification Pending"
                  checked={true}
                  readOnly
                  disabled={!!editId}
                />
                <MdSchedule size={18} /> Verification Pending
              </label>
              <label
                style={{
                  opacity: 0.5,
                  cursor: "not-allowed",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Verified"
                  checked={false}
                  disabled
                />
                <MdVerified size={18} /> Verified
              </label>
              <label
                style={{
                  opacity: 0.5,
                  cursor: "not-allowed",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Rejected"
                  checked={false}
                  disabled
                />
                <MdCancel size={18} /> Rejected
              </label>
            </RadioGroup>
            <HelperText style={{ marginTop: "8px" }}>
              <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
              {editId 
                ? "Status is automatically set to 'Verification Pending' when resubmitting" 
                : "All new applications start with 'Verification Pending' status"}
            </HelperText>
          </FormGroup>

          <TermsSection>
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={(e) =>
                setFormData({ ...formData, termsAccepted: e.target.checked })
              }
            />
            <label htmlFor="termsAccepted">
              <strong>Declaration:</strong> I hereby declare that the information provided in this burial record application is true and accurate to the best of my knowledge. I understand that providing false information may lead to legal action and the cancellation of this record. I agree to the <strong>Terms and Conditions</strong> of the <strong>Islamia School & Mosque Association</strong> Burial Application.
            </label>
          </TermsSection>

          <SubmitSection>
            <Button
              type="submit"
              $variant="primary"
              disabled={loading || !formData.termsAccepted}
              $size="lg"
            >
              {loading ? (
                <InlineSpinner />
              ) : (
                <>
                  <MdSave size={20} />
                  {editId ? (formData.status === "Rejected" ? "Resubmit Application" : "Update Record") : "Save Record"}
                </>
              )}
            </Button>
            <Button
              type="button"
              $variant="secondary"
              onClick={handleReset}
              disabled={loading}
              $size="lg"
            >
              <MdRefresh size={20} />
              Reset Form
            </Button>

            {autoSaveStatus && (
              <AutoSaveIndicator
                className={autoSaveStatus}
                $saving={autoSaveStatus === "saving"}
              >
                {autoSaveStatus === "saving" ? (
                  <>
                    <MdRefresh size={16} /> Saving draft...
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={16} /> Draft saved locally
                  </>
                )}
              </AutoSaveIndicator>
            )}
          </SubmitSection>
        </form>
      </Card>

      <Modal
        isOpen={showQRPreview}
        onClose={() => setShowQRPreview(false)}
        title="Scan to Pay"
        maxWidth="400px"
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <img
            src={paymentQrUrl}
            alt="Payment QR Code"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default DataCapture;
