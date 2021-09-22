/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import languageIcon from '../languageIcon';

const Diff = () => {
  const [fileUndefined, setFileUndefined] = useState([] as JSX.Element[]);
  const [filesWithDiff, setFilesWithDiff] = useState([]);
  const diff = (textOne = '', textTwo = '') => {
    let hasDiff = false;
    for (let i = 0; i < textOne.length; i += 1) {
      if (textOne[i] !== textTwo[i]) {
        hasDiff = true;
      }
    }
    return hasDiff;
  };
  return <ul className="diff" />;
};

export default Diff;
