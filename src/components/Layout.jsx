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
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${theme.colors.gray100};

  body.dark-theme & {
    border-bottom-color: #333;
  }

  img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }

  div {
    text-align: center;
  }

  h2 {
    font-size: 16px;
    font-weight: 800;
    margin: 0;
    color: ${theme.colors.primarySolid};
    letter-spacing: 0.5px;
    text-transform: uppercase;

    body.dark-theme & {
      color: #a78bfa;
    }
  }

  p {
    font-size: 10px;
    color: ${theme.colors.gray500};
    margin: 4px 0 0 0;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  @media (max-width: 767px) {
    flex-direction: row;
    padding: 12px 16px;
    border-bottom: none;
    border-right: 1px solid ${theme.colors.gray200};
    
    img {
      width: 32px;
      height: 32px;
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
    flex: 1;
    overflow-x: hidden;
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

  body.dark-theme & {
    color: #b0b0b0;
  }

  @media (min-width: 768px) {
    border-radius: ${theme.borderRadius.md};
    margin-bottom: 4px;
  }

  &:hover {
    background: ${theme.colors.gray100};
    color: ${theme.colors.primarySolid};

    body.dark-theme & {
      background: #2d2d2d;
      color: #a78bfa;
    }
  }

  &.active {
    background: #f0f4ff;
    color: ${theme.colors.primarySolid};

    body.dark-theme & {
      background: #3d2d5d;
      color: #a78bfa;
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
          <img src={ismaLogo} alt="ISMA Logo" />
          <div>
            <h2>Burial Records</h2>
            <p>ISMA OFFICIAL SYSTEM</p>
          </div>
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
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;
