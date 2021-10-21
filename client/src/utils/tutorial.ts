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
  imageWidth?: number;
  imageHeight?: number;
  currentProgressStep: number;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const sidebarTutorial: Tutorial = {
  title: 'Sidebar',
  text: 'Create folders, files, as well as, rename and delete options in the sidebar.',
  imageUrl:
    'https://media.discordapp.net/attachments/898188780786315264/900474983015407726/Sidebar.gif?width=340&height=677',
  imageWidth: 200,
  imageHeight: 350,
  currentProgressStep: 0,
  isLastStep: false,
  isFirstStep: true,
};
const sliderTutorial: Tutorial = {
  title: 'Slider',
  text: 'You can freely control the sidebar by expanding and reducing it for a wider space for the editor space.',
  imageUrl:
    'https://media.discordapp.net/attachments/898188780786315264/900474986848985128/Slider.gif',
  currentProgressStep: 1,
  isLastStep: false,
  isFirstStep: false,
};
const startCollabTutorial: Tutorial = {
  title: 'Start Collaboration',
  text: 'To start collaboration click on the "Start New Collaboration" button and a new button with the session ID will appear, where you can copy the session ID.',
  imageUrl:
    'https://media.discordapp.net/attachments/898188780786315264/900474985318088754/Start_Collaboration.gif',
  currentProgressStep: 2,
  isLastStep: false,
  isFirstStep: false,
};
const removeCollabTutorial: Tutorial = {
  title: 'Remove Collaborator',
  text: 'As a host, you can remove a collaborator by going on the profile picture and clicking on the X button, which appears when you hover on it.',
  imageUrl:
    'https://media.discordapp.net/attachments/898188780786315264/900474979974529034/Remove_Collaborator.gif',
  currentProgressStep: 3,
  isLastStep: false,
  isFirstStep: false,
};
const stopCollabTutorial: Tutorial = {
  title: 'Stop Collaboration',
  text: 'Stop the collaboration by clickling on the button "Stop Session".',
  imageUrl:
    'https://media.discordapp.net/attachments/898188780786315264/900474987608170526/Stop_Collaboration.gif',
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
