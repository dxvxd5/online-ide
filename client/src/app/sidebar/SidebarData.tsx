/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineHistory,
} from 'react-icons/ai';
import { BsFillFolderFill } from 'react-icons/bs';
import { FaCog, FaOpencart, FaFileAlt } from 'react-icons/fa';
import { useState } from 'react';
import { SidebarItem } from './models/SidebarItem';
import IdeModel from '../../data/model/model';

interface SideBarprop {
  model: IdeModel;
}

export const SidebarData: SidebarItem[] = [
  {
    title: 'Folder',
    path: '/folder',
    icon: <BsFillFolderFill />,
    iconClosed: <AiFillCaretDown />,
    iconOpened: <AiFillCaretUp />,
    subnav: [
      {
        title: 'File1',
        path: '/folder/file1',
        icon: <FaFileAlt />,
      },
      {
        title: 'File2',
        path: '/folder/file2',
        icon: <FaFileAlt />,
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
