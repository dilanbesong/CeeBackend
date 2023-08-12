const hoursAgo = (date = new Date()) => {
  const ms = new Date().getTime() - date.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return hours
}

export { hoursAgo }
