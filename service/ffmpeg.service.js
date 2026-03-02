import { __dirname } from "../utils/path.utils.js"

const convertVideoUsingNvidiaCuda = (filePath) => {
    return `ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i ${filePath} -f null -`
}
export const convertVideoToMp4 = async (filePath) => {

}