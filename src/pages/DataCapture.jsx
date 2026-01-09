import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiService from "../utils/api";
import { uploadMultipleToS3 } from "../utils/uploadToS3";
import { generateReceiptPDF } from "../utils/receiptGenerator";
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
} from "react-icons/md";
import { InlineSpinner } from "../components/Spinner";
import Tooltip from "../components/Tooltip";

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
    color: #3b82f6;
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

const SubmitSection = styled.div`
  margin-top: ${theme.spacing["2xl"]};
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

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idPassportNo: "",
    gender: "",
    age: "",
    ageCategory: "",
    dateOfDeath: getTodayDate(),
    dateOfBurial: getTodayDate(),
    applicantName: "",
    applicantEmail: "",
    applicantMobile: "",
    nextOfKinName: "",
    nextOfKinRelationship: "",
    nextOfKinContact: "",
    nextOfKinIdPassport: "",
    burialLocation: "",
    primaryService: "",
    amountPaidBurial: "",
    secondaryService: "",
    amountPaidSecondary: "",
    tertiaryService: "",
    amountPaidTertiary: "",
    mpesaRefNo: "",
    receiptNo: "",
    burialPermitNumber: "",
    burialPermitDate: getTodayDate(),
    burialPermitIssuedBy: "",
    burialPermitIssuedByContact: "",
    burialPermitIssuedTo: "",
    burialPermitIssuedToContact: "",
    status: "Verification Pending",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // '', 'saving', 'saved'
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await apiService.getLocations();
        setLocations(res.data || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

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
      const res = await apiService.getRecord(id);
      const record = res.data;
      setFormData({
        firstName: record.firstName || "",
        middleName: record.middleName || "",
        lastName: record.lastName || "",
        idPassportNo: record.idPassportNo || "",
        gender: record.gender || "Male",
        age: record.age || "",
        ageCategory: record.ageCategory || "",
        dateOfDeath: record.dateOfDeath ? record.dateOfDeath.split("T")[0] : "",
        dateOfBurial: record.dateOfBurial ? record.dateOfBurial.split("T")[0] : "",
        applicantName: record.applicantName || "",
        applicantEmail: record.applicantEmail || "",
        applicantMobile: record.applicantMobile || "",
        nextOfKinName: record.nextOfKinName || "",
        nextOfKinRelationship: record.nextOfKinRelationship || "",
        nextOfKinContact: record.nextOfKinContact || "",
        nextOfKinIdPassport: record.nextOfKinIdPassport || "",
        burialLocation: record.burialLocation || "Block A",
        primaryService: record.primaryService || "Burial",
        amountPaidBurial: record.amountPaidBurial || "",
        secondaryService: record.secondaryService || "None",
        amountPaidSecondary: record.amountPaidSecondary || "",
        tertiaryService: record.tertiaryService || "None",
        amountPaidTertiary: record.amountPaidTertiary || "",
        mpesaRefNo: record.mpesaRefNo || "",
        receiptNo: record.receiptNo || "",
        burialPermitNumber: record.burialPermitNumber || "",
        burialPermitDate: record.burialPermitDate ? record.burialPermitDate.split("T")[0] : "",
        burialPermitIssuedBy: record.burialPermitIssuedBy || "",
        burialPermitIssuedByContact: record.burialPermitIssuedByContact || "",
        burialPermitIssuedTo: record.burialPermitIssuedTo || "",
        burialPermitIssuedToContact: record.burialPermitIssuedToContact || "",
        status:
          record.status === "Pending"
            ? "Verification Pending"
            : record.status || "Verification Pending",
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

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);

    // Validate age when age category changes
    if (e.target.name === "ageCategory" && formData.age) {
      const ageValidation = validateAge(formData.age, e.target.value);
      if (!ageValidation.valid) {
        error(ageValidation.message);
      }
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Date of Death is not in the future
    if (formData.dateOfDeath) {
      const dod = new Date(formData.dateOfDeath);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (dod > today) {
        error("Date of Death cannot be in the future");
        return;
      }
    }

    // Validate age based on age category
    if (formData.ageCategory && formData.age) {
      const ageValidation = validateAge(formData.age, formData.ageCategory);
      if (!ageValidation.valid) {
        error(ageValidation.message);
        return;
      }
    }

    // Validate attachments are required for non-Stillborn/Infant cases
    const isExempt =
      formData.ageCategory === "Stillborn" || formData.ageCategory === "Infant";
    if (
      !isExempt &&
      !editId &&
      files.length === 0 &&
      existingAttachments.length === 0
    ) {
      error(
        "Attachments are required for this age category. Please upload at least one document."
      );
      return;
    }

    setLoading(true);

    try {
      // Upload files to S3 if any
      let attachments = [];
      if (files.length > 0) {
        try {
          const uploadedUrls = await uploadMultipleToS3(
            files,
            "public-records"
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
        "idPassportNo",
        "nextOfKinIdPassport",
        "amountPaidBurial",
        "amountPaidSecondary",
        "amountPaidTertiary",
        "mpesaRefNo",
        "secondaryService",
        "tertiaryService",
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
          if (key === "status" && value === "Verification Pending") {
            recordData[key] = "Pending";
          } else {
            recordData[key] = value;
          }
        }
      });

      recordData.attachments = attachments;

      if (editId) {
        // Update existing record (requires auth)
        await apiService.updateRecord(editId, recordData);
        success("Burial record updated successfully!");
      } else {
        // Create new record using public endpoint (no auth required)
        const res = await apiService.submitRecordPublic(recordData);
        const submittedRecord = res.data;
        success("Record created successfully!");

        // Generate and download receipt PDF
        try {
          console.log(
            "📄 Generating receipt PDF for:",
            submittedRecord.id || submittedRecord._id
          );
          generateReceiptPDF(submittedRecord, settings.formatDate);
          success("Receipt PDF downloaded successfully!");
        } catch (pdfErr) {
          console.error("⚠️ Error generating receipt PDF:", pdfErr);
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
          dateOfDeath: getTodayDate(),
          dateOfBurial: getTodayDate(),
          applicantName: "",
          applicantEmail: "",
          applicantMobile: "",
          nextOfKinName: "",
          nextOfKinRelationship: "",
          nextOfKinContact: "",
          nextOfKinIdPassport: "",
          burialLocation: "",
          primaryService: "",
          amountPaidBurial: "",
          secondaryService: "",
          amountPaidSecondary: "",
          tertiaryService: "",
          amountPaidTertiary: "",
          mpesaRefNo: "",
          receiptNo: "",
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
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      idPassportNo: "",
      gender: "",
      age: "",
      ageCategory: "",
      dateOfDeath: getTodayDate(),
      dateOfBurial: getTodayDate(),
      applicantName: "",
      applicantEmail: "",
      applicantMobile: "",
      nextOfKinName: "",
      nextOfKinRelationship: "",
      nextOfKinContact: "",
      nextOfKinIdPassport: "",
      burialLocation: "",
      primaryService: "",
      amountPaidBurial: "",
      secondaryService: "",
      amountPaidSecondary: "",
      tertiaryService: "",
      amountPaidTertiary: "",
      mpesaRefNo: "",
      receiptNo: "",
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
  };

  return (
    <div>
      <PageHeader>
        <div>
          <h1>New Record</h1>
          <p>Create and register a new burial record</p>
        </div>
        {editId && (
          <Button $variant="secondary" onClick={() => navigate("/records")}>
            <MdArrowBack size={18} /> Back to Records
          </Button>
        )}
      </PageHeader>

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
              <label>Applicant Email *</label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                placeholder="Enter applicant email"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Applicant Mobile No *</label>
              <input
                type="tel"
                name="applicantMobile"
                value={formData.applicantMobile}
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
              <label>ID / Passport No</label>
              <input
                name="idPassportNo"
                value={formData.idPassportNo}
                onChange={handleChange}
                placeholder="Enter ID or Passport number"
              />
            </FormGroup>
            <FormGroup>
              <label>
                Gender{" "}
                {formData.ageCategory !== "Stillborn" &&
                formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>
                Age{" "}
                {formData.ageCategory !== "Stillborn" &&
                formData.ageCategory !== "Infant"
                  ? "*"
                  : ""}
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
                required={
                  formData.ageCategory !== "Stillborn" &&
                  formData.ageCategory !== "Infant"
                }
              />
              {formData.ageCategory && (
                <HelperText>
                  <MdInfoOutline size={14} style={{ marginRight: "4px" }} />
                  {formData.ageCategory === "Stillborn"
                    ? "Age must be 0"
                    : formData.ageCategory === "Infant"
                    ? "Age must be between 0-1 years"
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
              <label>Next of Kin ID / Passport No</label>
              <input
                name="nextOfKinIdPassport"
                value={formData.nextOfKinIdPassport}
                onChange={handleChange}
                placeholder="Enter ID or Passport number"
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
                <option value="Block A">Block A</option>
                <option value="Main">Main</option>
                <option value="Block B">Block B</option>
                <option value="Lan'gata">Lan'gata</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <label>Primary Service</label>
              <select
                name="primaryService"
                value={formData.primaryService}
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                <option value="Burial">Burial</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Amount Paid for Burial</label>
              <input
                type="number"
                name="amountPaidBurial"
                value={formData.amountPaidBurial}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
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
              <label>Amount Paid for Secondary Service</label>
              <input
                type="number"
                name="amountPaidSecondary"
                value={formData.amountPaidSecondary}
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
              <label>Amount Paid for Other Services</label>
              <input
                type="number"
                name="amountPaidTertiary"
                value={formData.amountPaidTertiary}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon">
              <MdAssignment />
            </span>
            Burial Permit Details (Government Issued)
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Burial Permit Number *</label>
              <input
                name="burialPermitNumber"
                value={formData.burialPermitNumber}
                onChange={handleChange}
                placeholder="Enter government burial permit number"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Date of Burial Permit *</label>
              <ModernDatePicker
                value={formData.burialPermitDate}
                onChange={handleChange}
                name="burialPermitDate"
                placeholder="Pick date of permit issuance"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Permit Issued By *</label>
              <input
                name="burialPermitIssuedBy"
                value={formData.burialPermitIssuedBy}
                onChange={handleChange}
                placeholder="Name of authority"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Issuer Contact Address *</label>
              <input
                name="burialPermitIssuedByContact"
                value={formData.burialPermitIssuedByContact}
                onChange={handleChange}
                placeholder="Authority's office address"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Permit Issued To *</label>
              <input
                name="burialPermitIssuedTo"
                value={formData.burialPermitIssuedTo}
                onChange={handleChange}
                placeholder="Name of the person to whom permit was issued"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Recipient Contact Number *</label>
              <input
                type="tel"
                name="burialPermitIssuedToContact"
                value={formData.burialPermitIssuedToContact}
                onChange={handleChange}
                placeholder="Contact number of the permit holder"
                required
              />
            </FormGroup>
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
                  content="M-Pesa is a mobile money service used mainly in Kenya and Tanzania that allows people to send, receive, and pay using their phones without a bank account."
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
                placeholder="Enter M-Pesa reference number"
              />
            </FormGroup>
            <FormGroup>
              <label>Receipt No. *</label>
              <input
                name="receiptNo"
                value={formData.receiptNo}
                onChange={handleChange}
                placeholder="Enter receipt number"
                required
              />
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
            <ExemptionNote>
              <div className="icon">
                <MdCheckCircleOutline size={20} />
              </div>
              <div className="content">
                <h4>Exemption Notice</h4>
                <p>
                  For Stillborn and Infant cases, no attachments are required.
                  You can proceed without uploading any documents.
                </p>
              </div>
            </ExemptionNote>
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
              <FileInfo>{files.length} file(s) selected</FileInfo>
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
                  checked={formData.status === "Verification Pending"}
                  onChange={handleChange}
                />
                <MdSchedule size={18} /> Verification Pending
              </label>
              <label
                style={{
                  opacity: formData.status === "Verified" ? 1 : 0.5,
                  cursor: "not-allowed",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Verified"
                  checked={formData.status === "Verified"}
                  onChange={handleChange}
                  disabled
                />
                <MdVerified size={18} /> Verified
              </label>
              <label
                style={{
                  opacity: formData.status === "Rejected" ? 1 : 0.5,
                  cursor: "not-allowed",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Rejected"
                  checked={formData.status === "Rejected"}
                  onChange={handleChange}
                  disabled
                />
                <MdCancel size={18} /> Rejected
              </label>
            </RadioGroup>
          </FormGroup>

          <SubmitSection>
            <Button $variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <InlineSpinner size="16px" thickness="2px" /> Saving...
                </>
              ) : (
                <>
                  <MdSave size={18} /> Save Record
                </>
              )}
            </Button>
            <Button $variant="secondary" type="button" onClick={handleReset}>
              <MdRefresh size={18} /> Reset Form
            </Button>
          </SubmitSection>
        </form>
      </Card>
    </div>
  );
}

export default DataCapture;
