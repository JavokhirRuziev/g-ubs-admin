const postTypeList = [
  {value: 0, text: 'Обычный новость'},
  {value: 1, text: 'Фото новость'},
  {value: 2, text: 'Видео новость'},
  {value: 3, text: 'Слидер'},
];

const postType = (type) => {
  switch (type) {
    case 0:
      return "Обычный новость";
    case 1:
      return "Фото новость";
    case 2:
      return "Видео новость";
    case 3:
      return "Слидер";
    default:
      return "Обычный новость"
  }
};

const ambassadorsType = (type) => {
  switch (type) {
    case 1:
      return "Посол";
    case 2:
      return "Руководство";
    case 3:
      return "Журналист";
    default:
      return ""
  }
};

const embassiesType = (type) => {
  switch (type) {
    case 1:
      return "Посольство";
    case 2:
      return "Консульство";
    case 3:
      return "Консульский округ";
    default:
      return ""
  }
};

const feedbackLabel = (type) => {
  switch (type) {
    case 1:
      return "Задать вопрос";
    case 2:
      return "Отправить педложение";
    case 3:
      return "Пожаловатся";
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

export default {
  postTypeList,
  postType,
  ambassadorsType,
  embassiesType,
  formatBytes,
  feedbackLabel
}