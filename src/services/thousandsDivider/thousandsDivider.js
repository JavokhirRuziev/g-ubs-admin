const thousandsDivider = num => {
	const number = Number(num) || 0;
	const formatted = number
		? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
		: "0";
	return formatted;
};

export default thousandsDivider;
