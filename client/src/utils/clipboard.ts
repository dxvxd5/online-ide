import toast from 'react-hot-toast';

export default function copyToClipboard(toCopy: string, message = ''): void {
  navigator.clipboard.writeText(toCopy);
  if (message) toast.success(message);
}
