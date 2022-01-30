const feedbackLabel = (type) => {
  switch (type) {
    case 3:
      return "Педложение";
    case 4:
      return "Критика";
    case 5:
      return "Заявка";
    default:
      return ""
  }
};

const notificationType = (type) => {
  switch (type) {
    case 3:
      return "Обновление приложения";
    case 2:
      return "Скидки";
    case 1:
      return "Информация";
    default:
      return ""
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatDate = (date, format) => {
  let dt= new Date(date);
  let month = ("00" + (dt.getMonth() + 1)).slice(-2);
  let day = ("00" + dt.getDate()).slice(-2);
  let year = dt.getFullYear();
  let hours = ("00" + dt.getHours()).slice(-2);
  let minutes = ("00" + dt.getMinutes()).slice(-2);
  let seconds = ("00" + dt.getSeconds()).slice(-2);

  switch (format) {
    case "DD-MM-YYYY":
      return day+'-'+month+'-'+year;
    case "DD.MM.YYYY / HH:mm:ss":
      return  day+'.'+month+'.'+year+' / '+hours+':'+minutes+':'+seconds;
    default:
      return day+'.'+month+'.'+year
  }
};

export default {
  formatBytes,
  feedbackLabel,
  formatDate,
  notificationType
}