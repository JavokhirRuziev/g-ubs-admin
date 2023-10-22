export const dateFormatter = date => {
	const originalDate = date;

	const formattedDate = new Date(originalDate);

	const year = formattedDate.getFullYear();
	const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
	const day = String(formattedDate.getDate()).padStart(2, "0");

	const hours = String(formattedDate.getHours()).padStart(2, "0");
	const minutes = String(formattedDate.getMinutes()).padStart(2, "0");
	const seconds = String(formattedDate.getSeconds()).padStart(2, "0");

	const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

	return formattedDateTime;
};
