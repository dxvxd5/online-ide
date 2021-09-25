/* eslint-disable import/no-unresolved */
// import React, { FC, useState } from 'react';
import React, { FC } from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
// import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
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

const SidebarWrap = styled.div``;

const SidebarHelper: FC = () => {
  // const [sidebar, setSidebar] = useState(false);
  // const showSidebar = () => setSidebar(!sidebar);

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <Nav>
        {/* <NavIcon to="#" onClick={showSidebar}>
          <AiOutlineMenu />
        </NavIcon> */}
      </Nav>
      <SidebarNav>
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
