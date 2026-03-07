export const videoFileExtensions = [
  'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'ogv',
  'mpeg', 'mpg', 'm2v', 'vob', 'ts', 'mts', 'm2ts', 'divx', 'xvid', 'rm',
  'rmvb', 'asf', 'f4v', 'f4p', 'm4p', 'm4b', 'nsv', 'dvr-ms', 'tod',
  'mod', 'dv', 'vid', 'avs', 'vro', 'img', 'pva', 'tp', 'trp', 'yuv', 'y4m'
];

export function splitFilename(filename) {
  // Handle edge cases
  if (!filename || typeof filename !== 'string') {
    return { name: '', extension: '' };
  }
  
  // Convert to lowercase for case-insensitive matching
  const lowerFilename = filename.toLowerCase();
  const parts = filename.split('.');
  
  // Check if last part matches video extension
  const potentialExt = parts[parts.length - 1];
  const isVideoExt = videoFileExtensions.includes(potentialExt);
  
  if (isVideoExt && parts.length > 1) {
    // Remove extension and reconstruct name
    const name = parts.slice(0, -1).join('.');
    return {
      name: name,
      extension: potentialExt,
      isVideo: true
    };
  }
  
  // Not a video file or no extension
  return {
    name: filename,
    extension: '',
    isVideo: false
  };
}

export const audioFileExtensions = [
  'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma', 'aiff', 'aif', 'alac',
  'ape', 'opus', 'mp2', 'mpa', 'mpga', 'm4b', 'm4p', 'm4r', 'ac3', 'eac3',
  'dts', 'thd', 'tta', 'wv', 'shn', 'tak', 'dsf', 'dff', 'w64', 'rf64',
  'au', 'snd', 'raw', 'voc', 'midi', 'mid', 'kar', 'rmi', 'mus', 'cmf'
];

export function splitAudioFilename(filename) {
  // Handle edge cases
  if (!filename || typeof filename !== 'string') {
    return { name: '', extension: '' };
  }
  
  // Convert to lowercase for case-insensitive matching
  const lowerFilename = filename.toLowerCase();
  const parts = filename.split('.');
  
  // Check if last part matches audio extension
  const potentialExt = parts[parts.length - 1];
  const isAudioExt = audioFileExtensions.includes(potentialExt);
  
  if (isAudioExt && parts.length > 1) {
    // Remove extension and reconstruct name
    const name = parts.slice(0, -1).join('.');
    return {
      name: name,
      extension: potentialExt,
      isAudio: true
    };
  }
  
  // Not an audio file or no extension
  return {
    name: filename,
    extension: '',
    isAudio: false
  };
}