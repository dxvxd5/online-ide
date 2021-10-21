/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import Error from '../error/Error';
import Loader from '../loader/Loader';

interface PromiseNoDataProps {
  promise: Promise<unknown>;
  loadingMessage: string;
  errorMessage: string;
  tryAgain: () => void;
  classNameBlck?: string;
  onComplete?: (result: unknown) => void;
  onFailure?: () => void;
}

enum PromiseState {
  FAILURE,
  COMPLETE,
  ONGOING,
}

export default function PromiseNoData({
  promise,
  loadingMessage,
  onComplete,
  onFailure,
  tryAgain,
  errorMessage,
  classNameBlck,
}: PromiseNoDataProps): JSX.Element {
  const [promState, setPromState] = useState(PromiseState.ONGOING);

  useEffect(() => {
    promise
      .then((res) => {
        if (onComplete) onComplete(res);
        setPromState(PromiseState.COMPLETE);
      })
      .catch(() => {
        if (onFailure !== undefined) onFailure();
        setPromState(PromiseState.FAILURE);
      });
  }, []);

  switch (promState) {
    case PromiseState.ONGOING:
      return (
        <Loader
          message={loadingMessage}
          className={`loader--${classNameBlck}`}
        />
      );

    case PromiseState.FAILURE:
      return (
        tryAgain &&
        errorMessage && (
          <Error
            errorInfo={errorMessage}
            tryAgain={tryAgain}
            className={`error--${classNameBlck}`}
          />
        )
      );

    case PromiseState.COMPLETE:
    default:
      break;
  }
}
