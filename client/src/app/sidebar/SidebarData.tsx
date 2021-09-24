/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineHistory,
  AiOutlineHome,
  AiOutlineMoneyCollect,
  AiOutlineUser,
} from 'react-icons/ai';
import { FaCog, FaOpencart } from 'react-icons/fa';
import { SidebarItem } from './models/SidebarItem';

export const SidebarData: SidebarItem[] = [
  {
    title: 'Folder',
    path: '/main',
    icon: <AiOutlineHome />,
    iconClosed: <AiFillCaretDown />,
    iconOpened: <AiFillCaretUp />,
    subnav: [
      {
        title: 'File1',
        path: '/folder/file1',
        icon: <AiOutlineUser />,
      },
      {
        title: 'File2',
        path: '/folder/file2',
        icon: <AiOutlineMoneyCollect />,
      },
    ],
  },
  {
    title: 'Out File',
    path: '/out_file',
    icon: <FaOpencart />,
  },
  {
    title: 'History',
    path: '/history',
    icon: <AiOutlineHistory />,
  },
  {
    title: 'Setting',
    path: '/setting',
    icon: <FaCog />,
  },
];
