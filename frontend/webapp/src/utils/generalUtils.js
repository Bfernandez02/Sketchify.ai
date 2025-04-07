function formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
  
    if (diffInWeeks >= 1) {
      return `${diffInWeeks}w`;
    } else if (diffInDays >= 1) {
      return `${diffInDays}d`;
    } else if (diffInHours >= 1) {
      return `${diffInHours}h`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes}m`;
    } else {
      return `${diffInSeconds}s`;
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

export {formatTimeAgo};