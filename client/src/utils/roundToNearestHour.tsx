export const roundToNearestHour = (timeString: string): string => {
    const [date, time] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    const parsedMinutes = parseInt(minutes, 10);
    const roundedHours = parsedMinutes >= 30 ? (parseInt(hours, 10) + 1) : parseInt(hours, 10);
    const finalHours = roundedHours === 24 ? 0 : roundedHours;
    return `${date} ${finalHours.toString().padStart(2, '0')}:00`;
};