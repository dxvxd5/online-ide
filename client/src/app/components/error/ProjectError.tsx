import React from 'react';

interface ProjectErrorProps {
  projectErrorInfo: string;
  tryAgain: () => void;
}

const ProjectError = ({
  projectErrorInfo,
  tryAgain,
}: ProjectErrorProps): JSX.Element => {
  return (
    <div>
      <span>{projectErrorInfo}</span>
      <button type="submit" onClick={tryAgain}>
        Try again
      </button>
    </div>
  );
};

export default ProjectError;
