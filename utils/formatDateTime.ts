export const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('sk', {
    minute: '2-digit',
    hour: 'numeric',
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  })
}
