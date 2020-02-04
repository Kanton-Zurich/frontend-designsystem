
/* eslint-disable import/prefer-default-export */
export const sanitizeFileSize = (fileSize) => {
  if (fileSize === 0) return '0 Bytes';

  const k = 1024;
  const dm = 1;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(fileSize) / Math.log(k));

  return `${parseFloat((fileSize / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};
