import Swal from 'sweetalert2';

enum SwalFireState {
  IS_CONFIRMED,
  IS_DENIED,
  IS_DISMISSED,
}
interface Tutorial {
  title: string;
  text: string;
  imageUrl: string;
  currentProgressStep: number;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const sidebarTutorial: Tutorial = {
  title: 'Sidebar',
  text: 'You can create folders, files, as well as rename and delete them in the sidebar.',
  imageUrl: 'https://i.imgur.com/4x6oaIJ.gif',
  currentProgressStep: 0,
  isLastStep: false,
  isFirstStep: true,
};

const sliderTutorial: Tutorial = {
  title: 'Slider',
  text: 'You can expand or reduce the sidebar width according to your needs.',
  imageUrl: 'https://i.imgur.com/MMBJz2J.gif',
  currentProgressStep: 1,
  isLastStep: false,
  isFirstStep: false,
};

const startCollabTutorial: Tutorial = {
  title: 'Start Collaboration',
  text: 'To start a collaboration session, click on the "Start New Collaboration" button. A unique ID will be generated for your session and copied to your clipboard.You can always copy it again by clicking on the button "Copy Session ID" that appears then. Collaborators can join your session with that ID.',
  imageUrl: 'https://i.imgur.com/oA6BwD5.gif',
  currentProgressStep: 2,
  isLastStep: false,
  isFirstStep: false,
};

const removeCollabTutorial: Tutorial = {
  title: 'Remove Collaborator',
  text: 'When hosting a session, you can always remove collaborators by hovering on their profile picture and clicking on the "X" button that appears then.',
  imageUrl: 'https://i.imgur.com/ZtaxLxv.gif',
  currentProgressStep: 3,
  isLastStep: false,
  isFirstStep: false,
};

const stopCollabTutorial: Tutorial = {
  title: 'Stop Collaboration',
  text: 'You can stop or leave a collaboration session by clicking on the button "Stop Session" if you are the host or "Leave session" if you are not.',
  imageUrl: 'https://i.imgur.com/7x1DXiZ.gif',
  currentProgressStep: 4,
  isLastStep: true,
  isFirstStep: false,
};

const allTutorials: Tutorial[] = [
  sidebarTutorial,
  sliderTutorial,
  startCollabTutorial,
  removeCollabTutorial,
  stopCollabTutorial,
];

const steps = ['1', '2', '3', '4', '5'];

const swalQueue = Swal.mixin({
  progressSteps: steps,
  cancelButtonText: 'End Tutorial',
  denyButtonColor: '#4a5568',
  denyButtonText: '< Previous step',
  confirmButtonText: 'Next step >',
  reverseButtons: true,
  heightAuto: false,
  showCancelButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
});

async function fireTutorialStep(tutorial: Tutorial): Promise<SwalFireState> {
  const { isLastStep, isFirstStep, ...params } = tutorial;
  const tutorialStep = await swalQueue.fire({
    ...params,
    showDenyButton: !isFirstStep,
    showConfirmButton: !isLastStep,
  });
  if (tutorialStep.isDenied) return SwalFireState.IS_DENIED;
  if (tutorialStep.dismiss === Swal.DismissReason.cancel)
    return SwalFireState.IS_DISMISSED;
  return SwalFireState.IS_CONFIRMED;
}

export default async function fireTutorials(index = 0): Promise<void> {
  const result = await fireTutorialStep(allTutorials[index]);
  switch (result) {
    case SwalFireState.IS_CONFIRMED:
      fireTutorials(index + 1);
      break;
    case SwalFireState.IS_DENIED:
      fireTutorials(index - 1);
      break;
    default:
      break;
  }
}
