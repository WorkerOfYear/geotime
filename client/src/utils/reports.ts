export function formatDate(inputTime: string) {
  const dateTimeParts = inputTime.split(" ");
  const dateParts = dateTimeParts[0].split("-");
  const timeParts = dateTimeParts[1].split(":");

  const year = dateParts[0].slice(-2);
  const month = dateParts[1];
  const day = dateParts[2];
  const hours = timeParts[0];
  const minutes = timeParts[1];
  const seconds = Math.floor(parseFloat(timeParts[2])).toString(); // Округляем до целого числа

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
