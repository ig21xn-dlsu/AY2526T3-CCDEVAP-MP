export function formatTimeAgo(dateString) {
    const secondsAgo = Math.floor((new Date() - new Date(dateString)) / 1000);

    if (secondsAgo < 60) {
        return 'Just now';
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} min${minutesAgo !== 1 ? 's' : ''} ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hr${hoursAgo !== 1 ? 's' : ''} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
}