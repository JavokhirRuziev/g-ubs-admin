import variables from "../../variables";

const feedbackLabel = (type) => {
	switch (type) {
		case 3:
			return "Педложение";
		case 4:
			return "Критика";
		case 5:
			return "Заявка";
		default:
			return "";
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
			return "";
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
	let dt = new Date(date);
	let month = ("00" + (dt.getMonth() + 1)).slice(-2);
	let day = ("00" + dt.getDate()).slice(-2);
	let year = dt.getFullYear();
	let hours = ("00" + dt.getHours()).slice(-2);
	let minutes = ("00" + dt.getMinutes()).slice(-2);
	let seconds = ("00" + dt.getSeconds()).slice(-2);

	switch (format) {
		case "DD-MM-YYYY":
			return day + "-" + month + "-" + year;
		case "DD.MM.YYYY / HH:mm:ss":
			return day + "." + month + "." + year + " / " + hours + ":" + minutes + ":" + seconds;
		case "DD.MM.YYYY / HH:mm":
			return day + "." + month + "." + year + " / " + hours + ":" + minutes;
		case "HH:mm / DD.MM.YYYY":
			return hours + ":" + minutes + " / " + day + "." + month + "." + year;
		default:
			return day + "." + month + "." + year;
	}
};

const getOrderType = (status) => {
	switch (status) {
		case variables.TYPE_DELIVERY:
			return "Доставка";
		case variables.TYPE_BOOKING:
			return "Брон";
		case variables.TYPE_ON_TABLE:
			return "На стол";
		case variables.TYPE_TAKEAWAY:
			return "На вынос";
		default:
			return "Не указон";
	}
};

const orderTypes = [
	{value: variables.TYPE_DELIVERY, name: "Доставка"},
	{value: variables.TYPE_BOOKING, name: "Брон"},
	{value: variables.TYPE_ON_TABLE, name: "На стол"},
	{value: variables.TYPE_TAKEAWAY, name: "На вынос"},
]

const orderStatus = [
	{value: variables.STATUS_REJECTED, name: "Отклоненные"},
	{value: variables.STATUS_COMPLETED, name: "Завершенные"},
	{value: variables.STATUS_NEW, name: "Новый"},
]

const getOrderStatus = (status) => {
	switch (Number(status)) {
		case variables.STATUS_NEW:
			return { color: "orange", label: "Новые" };
		case variables.STATUS_ATTACHING:
			return { color: "orange", label: "Ожидания повора" };
		case variables.STATUS_PREPARING:
			return { color: "blue", label: "Готовится блюдо" };
		case variables.STATUS_PREPARE_COMPLETED:
			return { color: "green", label: "Блюдо готово" };
		case variables.STATUS_PREPARE_REJECTED:
			return { color: "red", label: "Блюдо отменено" };
		case variables.STATUS_COMING_YOU:
			return { color: "purple", label: "Доставка" };
		case variables.STATUS_AWAITING_YOU:
			return { color: "purple", label: "Ожидания клиента" };
		case variables.STATUS_COMPLETED:
			return { color: "green", label: "Завершено" };
		case variables.STATUS_REJECTED:
			return { color: "red", label: "Отменено" };
		default:
			return { color: "red", label: "#ошибка" };
	}
};

export default {
	formatBytes,
	feedbackLabel,
	formatDate,
	notificationType,
	getOrderType,
	getOrderStatus,
	orderTypes,
	orderStatus
};