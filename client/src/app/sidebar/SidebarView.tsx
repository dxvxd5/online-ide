/* eslint-disable import/no-unresolved */
// import React, { FC, useState } from 'react';
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
// import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { VscNewFile } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import Submenu from './Submenu';

const Nav = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 5rem;
  background-color: black;
`;
// const SidebarNav = styled.div<{ sidebar: boolean }>`
const SidebarNav = styled.div`
  width: 250px;
  height: 100vh;
  background-color: black;
  position: fixed;
  top: 10;
  transition: 350ms;
`;
// left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};

// const NavIcon = styled(Link)`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   height: 5rem;
//   font-size: 2rem;
//   margin-left: 2rem;
// `;
const NavIcon = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 5rem;
  font-size: 3rem;
  margin-left: 2rem;
`;

const SidebarWrap = styled.div``;

interface FilesData {
  name: string;
  id: string;
}
interface SideBarProp {
  projectID: string;
  files: FilesData[];
  handleFileName: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const SidebarHelper = ({
  projectID,
  files,
  handleFileName,
}: SideBarProp): JSX.Element => {
  // const SidebarHelper: FC = () => {
  // const [sidebar, setSidebar] = useState(false);
  // const showSidebar = () => setSidebar(!sidebar);

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <Nav>
        {/* <NavIcon to="#" onClick={showSidebar}>
          <AiOutlineMenu />
        </NavIcon> */}
        <NavIcon to="#">
          <CgProfile />
        </NavIcon>
      </Nav>
      <h1>Create File</h1>
      <SidebarNav>
        <NavIcon to="#" onClick={(e) => handleFileName(e)}>
          <VscNewFile />
        </NavIcon>
        <h2>Upload File</h2>
        {/** TODO: Upload icon and component */}
        <SidebarWrap>
          {/* <NavIcon to="#" onClick={showSidebar}>
            <AiOutlineClose />
          </NavIcon> */}
          {SidebarData.map((item, index) => {
            // eslint-disable-next-line react/no-array-index-key
            return <Submenu item={item} key={index} />;
          })}
        </SidebarWrap>
      </SidebarNav>
    </IconContext.Provider>
  );
};

export default SidebarHelper;
