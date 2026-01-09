import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, theme } from '../styles/CommonStyles';
import { MdArrowForward, MdAssignment, MdPerson, MdPhone, MdLocationOn, MdPayment, MdAttachFile } from 'react-icons/md';

const HomeContainer = styled.div`
  font-family: ${theme.fonts.body};
  max-width: 900px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']} 0;
  margin-bottom: ${theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${theme.colors.gray900};
  margin: 0 0 ${theme.spacing.md} 0;

  body.dark-theme & {
    color: #e5e5e5;
  }

  @media (min-width: 768px) {
    font-size: 42px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: ${theme.colors.gray600};
  line-height: 1.6;
  margin: 0 0 ${theme.spacing.xl} 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

const CTAButton = styled(Button)`
  font-size: 18px;
  padding: 16px 40px;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const InfoCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const CardTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin: 0 0 ${theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.gray50};
  border-radius: ${theme.borderRadius.md};

  body.dark-theme & {
    background: #2d2d2d;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.primarySolid};
  border-radius: ${theme.borderRadius.md};
  color: white;
  font-size: 20px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin-bottom: 4px;
  font-size: 15px;

  body.dark-theme & {
    color: #e5e5e5;
  }
`;

const InfoDescription = styled.div`
  font-size: 14px;
  color: ${theme.colors.gray600};
  line-height: 1.5;

  body.dark-theme & {
    color: #b0b0b0;
  }
`;

function Home() {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Burial Record Management</HeroTitle>
        <HeroSubtitle>
          Register and manage burial records efficiently. Submit your information to create a new burial record.
        </HeroSubtitle>
        <CTAButton $variant="primary" onClick={() => navigate('/data-capture')}>
          Create New Record
          <MdArrowForward size={22} />
        </CTAButton>
      </HeroSection>

      <InfoCard>
        <CardTitle>
          <MdAssignment size={24} />
          Required Information
        </CardTitle>
        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <MdAssignment />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Applicant Details</InfoLabel>
              <InfoDescription>Name, email, and mobile number</InfoDescription>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <MdPerson />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Deceased Information</InfoLabel>
              <InfoDescription>Name, age, gender, date of death</InfoDescription>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <MdPhone />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Next of Kin</InfoLabel>
              <InfoDescription>Contact name and phone number</InfoDescription>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <MdLocationOn />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Burial Details</InfoLabel>
              <InfoDescription>Location and services provided</InfoDescription>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <MdPayment />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Payment</InfoLabel>
              <InfoDescription>Receipt number and M-Pesa reference</InfoDescription>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <MdAttachFile />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Documents</InfoLabel>
              <InfoDescription>Supporting documents (required for non-Stillborn/Infant cases)</InfoDescription>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </InfoCard>
    </HomeContainer>
  );
}

export default Home;
