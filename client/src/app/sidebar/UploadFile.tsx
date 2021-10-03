// import * as React from 'react';
// import { useState, useEffect } from 'react';

export interface File {
  name: string;
  lastModified: number;
  size: number;
  type: string;
}

// export interface UploadFileProps {
//   onFilesSelected?: (files: File[]) => void;
// }

// export const UploadFile = (props: UploadFileProps) => {
//   const [selectedFiles, setFiles] = useState();

//   const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
//     const files = (e.target as HTMLInputElement).files || [];
//     setFiles(Array.from(files));
//   };

//   useEffect(() => {
//     if (!props.onFilesSelected) return;
//     props.onFilesSelected(selectedFiles);
//   }, [selectedFiles, props]);

//   return (
//     <input
//       type="file"
//       accept="image/*,.pdf,.doc,.docx,.txt"
//       onChange={handleOnChange}
//       multiple
//     />
//   );
// };
