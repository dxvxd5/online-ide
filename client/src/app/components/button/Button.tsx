/* eslint-disable react/require-default-props */
import React from 'react';

import '../../../assets/styles/button.css';

interface ButtonProps {
  onClick?: (e: unknown) => void;
  text: string;
  className?: string;
  theme: 'main' | 'secondary' | 'red';
  submit: boolean;
  title?: string;
}

export default function Button({
  onClick,
  text,
  className,
  theme,
  submit,
  title,
}: ButtonProps): JSX.Element {
  return (
    <button
      title={title}
      onClick={onClick || null}
      className={`button button--${theme} ${className}`}
      type={submit ? 'submit' : 'button'}
    >
      {text}
    </button>
  );
}
