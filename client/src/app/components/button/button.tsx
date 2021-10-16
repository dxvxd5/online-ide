import React from 'react';

import '../../../assets/styles/button.css';

interface ButtonProps {
  // eslint-disable-next-line react/require-default-props
  onClick?: (e: unknown) => void;
  text: string;
  // eslint-disable-next-line react/require-default-props
  className?: string;
  theme: 'main' | 'secondary' | 'red';
  submit: boolean;
}

export default function Button({
  onClick,
  text,
  className,
  theme,
  submit,
}: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick || null}
      className={`button button--${theme} ${className}`}
      type={submit ? 'submit' : 'button'}
    >
      {text}
    </button>
  );
}
