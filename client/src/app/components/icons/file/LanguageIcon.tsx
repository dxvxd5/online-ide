import React from 'react';
import { SiTypescript } from 'react-icons/si';
import { AiFillFile } from 'react-icons/ai';
import { IconType } from 'react-icons';

export default function LanguageIcon(fileLanguage: string): IconType {
  switch (fileLanguage) {
    case 'typescript':
      return SiTypescript;
      break;
    default:
      return AiFillFile;
  }
}
