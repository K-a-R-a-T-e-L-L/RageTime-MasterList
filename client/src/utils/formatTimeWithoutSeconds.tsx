export const formatTimeWithoutSeconds = (timeString: string): string => {
    const [date, time] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    return `${date} ${hours}:${minutes}`;
};