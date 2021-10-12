import React, { useEffect } from 'react';
import IdeModel from './data/model/model';

interface RoutePresenterProps {
  model: IdeModel;
}

export default function RoutePresenter({
  model,
}: RoutePresenterProps): JSX.Element {
  useEffect(function () {
    const hashListener = function () {
      switch (window.location.pathname) {
        case '/me':
          if (model.roomID) model.stopCollaboration();
          break;
        default:
          break;
      }
    };
    window.addEventListener('popstate', hashListener);

    return function () {
      window.removeEventListener('popstate', hashListener);
    };
  }, []);

  return null;
}
