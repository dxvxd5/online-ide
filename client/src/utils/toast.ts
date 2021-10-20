import toast from 'react-hot-toast';

export default function toastPromise(
  promise: Promise<unknown>,
  msgs: { loading: string; error: string; success: string }
): Promise<unknown> {
  return toast.promise(promise, msgs);
}
