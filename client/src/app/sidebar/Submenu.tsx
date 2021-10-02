import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SidebarItem } from './models/SidebarItem';

type SidebarLinkProps = {
  item: SidebarItem;
};

const SidebarLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.75rem;
  font-size: 1.125rem;
  padding: 2rem;
  text-decoration: none;
  color: #ffffff;
  &:hover {
    background-color: #1f1f1b;
    border-left: 4px solid #6d44dc;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 1rem;
`;

const DropdownLink = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 3.75rem;
  font-size: 1.125rem;
  padding-left: 3rem;
  text-decoration: none;
  color: #ffffff;
  &:hover {
    background-color: #6d44dc;
  }
`;

const Submenu: FC<SidebarLinkProps> = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.projectsData.id} onClick={showSubnav}>
        <div>
          {/* {item.icon} */}
          <SidebarLabel>{item.projectsData.name}</SidebarLabel>
        </div>
        <div>
          {item?.subnav && subnav ? item?.iconOpened : item?.iconClosed}
        </div>
      </SidebarLink>
      {subnav &&
        item?.subnav?.map((subnavItem, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <DropdownLink to={subnavItem.filesData.id} key={index}>
              {/* {subnavItem.icon} */}
              <SidebarLabel>{subnavItem.filesData.name}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default Submenu;
