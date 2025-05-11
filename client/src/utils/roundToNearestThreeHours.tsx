export const roundToNearestThreeHours = (timeString: string): string => {
    const [date, time] = timeString.split(' ');
    const [hours] = time.split(':');
    const parsedHours = parseInt(hours, 10);
    const roundedHours = Math.floor(parsedHours / 3) * 3;
    return `${date} ${roundedHours.toString().padStart(2, '0')}:00`;
};