/* eslint-disable react/require-default-props */
import React from 'react';

import '../../../assets/styles/loader.css';

interface LoaderProps {
  message: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Loader({
  message,
  className,
  style,
}: LoaderProps): JSX.Element {
  return (
    <div className={`container loader ${className}`} style={style}>
      <div className="loader__container">
        <div className="loader__spinner">
          <div className="spinner--color" data-bind="css: {}" />
        </div>
      </div>
      <br />
      <div className="loader--description" data-bind="text: description">
        {message}
      </div>
    </div>
  );
}
