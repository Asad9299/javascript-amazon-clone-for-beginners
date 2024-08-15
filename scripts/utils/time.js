import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
export function formatTime(datetime) {
    return dayjs(datetime).format('dddd, MMMM DD h:mm A');
}