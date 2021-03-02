import React from "react";
import cx from "classnames";
import { Checkbox } from "antd";
import PropTypes from "prop-types";

const propTypes = {
	field: PropTypes.object.isRequired,
	form: PropTypes.object.isRequired,
	fieldClassName: PropTypes.string,
	hasMargin: PropTypes.bool,
	marginBottom: PropTypes.string,
	title: PropTypes.string.isRequired,
	onChange: PropTypes.func
};
const defaultProps = {
	hasMargin: true,
	marginBottom: null,
	fieldClassName: ""
};

const AntCheckbox = ({
	title,
	field: { name },
	form: { setFieldValue },
	fieldClassName,
	hasMargin,
	marginBottom,
	onChange,
	...props
}) => {
	const fieldClasses = cx("field-container", fieldClassName);

	return (
		<div className={fieldClasses}>
			<Checkbox
				{...props}
				onChange={onChange ? onChange : ({ target: { checked } }) => setFieldValue(name, Number(checked))}>
				{title}
			</Checkbox>
		</div>
	);
};

AntCheckbox.propTypes = propTypes;
AntCheckbox.defaultProps = defaultProps;

export default AntCheckbox;
