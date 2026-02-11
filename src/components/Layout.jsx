import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/CommonStyles';
import { MdAssignment, MdHome } from 'react-icons/md';
import ismaLogo from '../assets/ISMA-logo.png';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.gray50};
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  body.dark-theme & {
    background: #1a1a1a;
  }
`;

const Sidebar = styled.aside`
  width: 100%;
  height: auto;
  background: white;
  color: ${theme.colors.gray900};
  position: relative;
  border-bottom: 1px solid ${theme.colors.gray200};
  z-index: 100;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  
  body.dark-theme & {
    background: #1f1f1f;
    border-bottom-color: #404040;
  }

  @media (min-width: 768px) {
    width: 260px;
    height: 100vh;
    position: fixed;
    border-right: 1px solid ${theme.colors.gray200};
    border-bottom: none;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;

    body.dark-theme & {
      border-right-color: #404040;
      border-bottom-color: transparent;
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${theme.colors.gray100};

  body.dark-theme & {
    border-bottom-color: #333;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    background: white;
    border-radius: 12px;
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  div {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  h2 {
    font-size: 15px;
    font-weight: 900;
    margin: 0;
    color: #3D2F2F;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.3;

    body.dark-theme & {
      color: #7c3aed;
    }
  }

  p {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    margin: 0;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1.4;
  }

  @media (max-width: 767px) {
    flex-direction: row;
    padding: 12px 16px;
    border-bottom: none;
    border-right: 1px solid ${theme.colors.gray200};
    
    img {
      width: 48px;
      height: 48px;
    }

    p { display: none; }
    h2 { font-size: 14px; }
  }
`;

const NavLinksContainer = styled.nav`
  display: flex;
  flex-direction: row;
  gap: 0;
  padding: 0;
  flex: 1;
  overflow-x: auto;

  @media (min-width: 768px) {
    flex-direction: column;
    gap: 4px;
    padding: 16px 12px;
    flex: none;
    overflow-x: hidden;
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid ${theme.colors.gray100};

  body.dark-theme & {
    border-top-color: #333;
  }
`;

const SidebarAddress = styled.div`
  font-size: 11px;
  color: ${theme.colors.gray500};
  margin: 16px 0 0 0;
  padding: 12px 0;
  border-top: 1px solid ${theme.colors.gray100};
  border-bottom: 1px solid ${theme.colors.gray100};
  width: 100%;
  text-align: center;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }

  body.dark-theme & {
    color: #a0a0a0;
    border-top-color: #333;
    border-bottom-color: #333;
  }

  p {
    margin: 3px 0;
    line-height: 1.4;
    text-transform: none;
    font-weight: 500;
    letter-spacing: normal;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${theme.colors.gray600};
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all ${theme.transitions.base};
  white-space: nowrap;
  border-radius: 0;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  body.dark-theme & {
    color: #b0b0b0;
  }

  @media (min-width: 768px) {
    border-radius: ${theme.borderRadius.md};
    margin-bottom: 4px;
    white-space: normal;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${theme.colors.primarySolid};
    transform: scaleY(0);
    transition: transform ${theme.transitions.base};
    border-radius: 0 4px 4px 0;

    @media (max-width: 767px) {
      width: 100%;
      height: 3px;
      top: auto;
      bottom: 0;
      border-radius: 4px 4px 0 0;
    }
  }

  &:hover {
    background: ${theme.colors.gray100};
    color: ${theme.colors.primarySolid};
    padding-left: 20px;

    body.dark-theme & {
      background: #2d2d2d;
      color: #a78bfa;
    }
  }

  &.active {
    background: linear-gradient(90deg, rgba(61, 47, 47, 0.1) 0%, transparent 100%);
    color: ${theme.colors.primarySolid};
    font-weight: 600;

    body.dark-theme & {
      background: linear-gradient(90deg, rgba(167, 139, 250, 0.2) 0%, transparent 100%);
      color: #a78bfa;
    }

    &::before {
      transform: scaleY(1);
    }
  }

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.lg};
  overflow-y: auto;

  @media (min-width: 768px) {
    margin-left: 260px;
    padding: ${theme.spacing.xl};
  }

  body.dark-theme & {
    background: #1a1a1a;
  }
`;

function Layout() {
  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <div>
            <p>BURIAL APPLICATION</p>
          </div>
          <img src={ismaLogo} alt="Islamia School & Mosque Association Logo" />
          <div>
            <h2>Islamia School & Mosque Association</h2>
          </div>
          <SidebarAddress>
            <p>CUSTODIANS OF THE SUNNI MUSLIM</p>
            <p>CEMETERIES - KARIOKOR & LANGATA</p>
            <p>P.O. Box 21015 - 00500 NAIROBI</p>
            <p>Cell / Whatsapp: +254 113217749</p>
            <p>Email: office@isma.co.ke</p>
          </SidebarAddress>
        </SidebarHeader>
        <NavLinksContainer>
          <StyledNavLink to="/" end>
            <MdHome size={18} />
            <span>Home</span>
          </StyledNavLink>
          <StyledNavLink to="/records">
            <MdAssignment size={18} />
            <span>Records History</span>
          </StyledNavLink>
        </NavLinksContainer>
        <SidebarFooter>
          <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
            © {new Date().getFullYear()} ISMA Burial Application
          </div>
        </SidebarFooter>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;
