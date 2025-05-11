export const roundToNearestFiveMinutes = (timeString: string): string => {
    const [date, time] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    const roundedMinutes = Math.floor(parseInt(minutes) / 5) * 5;
    const formattedMinutes = roundedMinutes.toString().padStart(2, '0');
    return `${date} ${hours}:${formattedMinutes}`;
};