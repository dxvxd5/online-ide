import React from 'react';
import { Javascript, Html, Css } from './customIcons';

const languageIcon = (name: string) => {
  const splited = name.split('.');
  const ext = splited[splited.length - 1];
  let icon = null;
  if (ext === 'js') {
    icon = <Javascript />;
  } else if (ext === 'html') {
    icon = <Html />;
  } else if (ext === 'css') {
    icon = <Css />;
  }
  return icon;
};

export default languageIcon;
