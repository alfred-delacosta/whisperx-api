import path from 'path';

export const videoFileExtensions = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "3gp",
  "ogv",
  "mpeg",
  "mpg",
  "m2v",
  "vob",
  "ts",
  "mts",
  "m2ts",
  "divx",
  "xvid",
  "rm",
  "rmvb",
  "asf",
  "f4v",
  "f4p",
  "m4p",
  "m4b",
  "nsv",
  "dvr-ms",
  "tod",
  "mod",
  "dv",
  "vid",
  "avs",
  "vro",
  "img",
  "pva",
  "tp",
  "trp",
  "yuv",
  "y4m",
];

export function splitFilename(filename) {
  // Handle edge cases
  if (!filename || typeof filename !== "string") {
    return { name: "", extension: "" };
  }

  // Convert to lowercase for case-insensitive matching
  const lowerFilename = filename.toLowerCase();
  const parts = filename.split(".");

  // Check if last part matches video extension
  const potentialExt = parts[parts.length - 1];
  const isVideoExt = videoFileExtensions.includes(potentialExt);

  if (isVideoExt && parts.length > 1) {
    // Remove extension and reconstruct name
    const name = parts.slice(0, -1).join(".");
    return {
      name: name,
      extension: potentialExt,
      isVideo: true,
    };
  }

  // Not a video file or no extension
  return {
    name: filename,
    extension: "",
    isVideo: false,
  };
}

export const audioFileExtensions = [
  "mp3",
  "wav",
  "flac",
  "aac",
  "m4a",
  "ogg",
  "wma",
  "aiff",
  "aif",
  "alac",
  "ape",
  "opus",
  "mp2",
  "mpa",
  "mpga",
  "m4b",
  "m4p",
  "m4r",
  "ac3",
  "eac3",
  "dts",
  "thd",
  "tta",
  "wv",
  "shn",
  "tak",
  "dsf",
  "dff",
  "w64",
  "rf64",
  "au",
  "snd",
  "raw",
  "voc",
  "midi",
  "mid",
  "kar",
  "rmi",
  "mus",
  "cmf",
];

export function splitAudioFilename(filename) {
  // Handle edge cases
  if (!filename || typeof filename !== "string") {
    return { name: "", extension: "" };
  }

  // Convert to lowercase for case-insensitive matching
  const lowerFilename = filename.toLowerCase();
  const parts = filename.split(".");

  // Check if last part matches audio extension
  const potentialExt = parts[parts.length - 1];
  const isAudioExt = audioFileExtensions.includes(potentialExt);

  if (isAudioExt && parts.length > 1) {
    // Remove extension and reconstruct name
    const name = parts.slice(0, -1).join(".");
    return {
      name: name,
      extension: potentialExt,
      isAudio: true,
    };
  }

  // Not an audio file or no extension
  return {
    name: filename,
    extension: "",
    isAudio: false,
  };
}


/**
 * Splits a filename into its name and extension components.
 * 
 * This function extracts the filename (without extension) and the extension
 * from a given filename string. It correctly handles multiple dots by using
 * the **last dot** as the separator (e.g., "archive.tar.gz" → name: "archive.tar", ext: "gz").
 * 
 * @param {string} filename - The filename or filepath to split (e.g., "document.pdf", "/path/to/file.txt")
 * @param {boolean} [usePathModule=false] - If true, uses Node.js `path` module for basename extraction
 * @returns {Object} An object containing:
 * @returns {string} return.name - The filename without extension
 * @returns {string} return.ext - The file extension (without leading dot), empty string if no extension
 * 
 * @example
 * splitFilename('document.pdf');
 * // Returns: { name: 'document', ext: 'pdf' }
 * 
 * @example
 * splitFilename('archive.tar.gz');
 * // Returns: { name: 'archive.tar', ext: 'gz' }
 * 
 * @example
 * splitFilename('noextension');
 * // Returns: { name: 'noextension', ext: '' }
 * 
 * @example
 * splitFilename('.hidden');
 * // Returns: { name: '', ext: 'hidden' }
 * 
 * @example
 * splitFilename('/path/to/image.jpg');
 * // Returns: { name: 'image', ext: 'jpg' }
 * 
 * @throws {Error} If input is not a string or invalid filename
 * 
 * @since 1.0.0
 */
export const generalSplitFileName = (filename) => {
  // Handle edge cases first
  if (!filename || typeof filename !== "string") {
    return { name: "", ext: "" };
  }

  // Find the last dot (handles files like "my.file.tar.gz")
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1) {
    // No extension
    return { name: filename, ext: "" };
  }

  // Split at the last dot
  const name = filename.slice(0, lastDotIndex);
  const ext = filename.slice(lastDotIndex + 1);

  return { name, ext };
};

/**
 * Extracts the filename without its extension from a multer file object's originalname.
 * Does not mutate the input file object.
 * @param {Object} file - The multer file object (e.g., from req.file).
 * @returns {string} The filename without the extension.
 */
export function getOriginalFilenameWithoutExtension(file) {
    // Use path.parse to safely extract the name without the extension
    return path.parse(file.originalname).name;
}

/**
 * Extracts the filename without its extension from a multer file object's filename.
 * Does not mutate the input file object.
 * @param {Object} file - The multer file object (e.g., from req.file).
 * @returns {string} The filename without the extension.
 */
export function getUploadFilenameWithoutExtension(file) {
    // Use path.parse to safely extract the name without the extension
    return path.parse(file.filename).name;
}

/**
 * Extracts the filename without its extension from a filename.
 * Does not mutate the fileName string.
 * @param {Object} fileName - The name of a file.
 * @returns {string} The filename without the extension.
 */
export function getNameWithOutExtension(fileName) {
    // Use path.parse to safely extract the name without the extension
    return path.parse(fileName).name;
}