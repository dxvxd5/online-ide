/* eslint-disable import/no-unresolved */
// import React, { FC, useState } from 'react';
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
// import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import Submenu from './Submenu';
import Message from '../../data/model/message';
import IdeModel from '../../data/model/model';

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
interface SideBarprop {
  model: IdeModel;
}

interface FilesData {
  name: string;
  id: string;
}

function SidebarHelper({ model }: SideBarprop): JSX.Element {
  const userID = model.getUserID();
  const [files, setFiles] = useState(model.getFiles());

  useEffect(() => {
    const fileObserver = (m: Message) => {
      if (m === Message.FILES_CHANGE) setFiles(model.getFiles() as FilesData[]);
    };
    model.addObserver(fileObserver);

    return () => model.removeObserver(fileObserver);
  }, []);

  const filesData: FilesData[] = files;
  setFiles([...filesData]);

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
}

export default SidebarHelper;
