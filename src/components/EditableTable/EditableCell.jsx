import React, { Component } from "react";
import { Input, Form } from "antd";

import EditableContext from "./EditableContext";

class EditableCell extends Component {
	state = {
		editing: false
	};

	toggleEdit = () => {
		const editing = !this.state.editing;
		this.setState({ editing }, () => {
			if (editing) {
				this.input.focus();
			}
		});
	};

	onPressEnterHandler = e => {
		const { dataIndex, record, onSave, alwaysEditable } = this.props;

		this.form.validateFields((error, values) => {
			if (error && error[e.currentTarget.id]) {
				return;
			}
			this.toggleEdit();
			if (alwaysEditable) {
				return onSave({
					id: dataIndex,
					value: values[dataIndex]
				});
			}

			onSave({
				oldValue: { ...record },
				newValue: {
					id: record.id,
					language: dataIndex,
					translation: values[dataIndex]
				}
			});
		});
	};

	onBlurHandler = e => {
		this.toggleEdit();
	};

	renderCell = form => {
		this.form = form;
		const { children, dataIndex, record, alwaysEditable } = this.props;
		const { editing } = this.state;

		let params = {};

		if (alwaysEditable) {
			params = {
				...params,
				className: "always-editable-component",
				placeholder: record.placeholder
			};
		}

		return editing || alwaysEditable ? (
			<Form.Item style={{ margin: 0 }}>
				{form.getFieldDecorator(dataIndex, {
					initialValue: record[dataIndex]
				})(
					record.type === "textarea" ? (
						<Input.TextArea
							{...params}
							ref={node => (this.input = node)}
							onPressEnter={this.onPressEnterHandler}
							onBlur={this.onBlurHandler}
						/>
					) : (
						<Input
							{...params}
							ref={node => (this.input = node)}
							onPressEnter={this.onPressEnterHandler}
							onBlur={this.onBlurHandler}

						/>
					)
				)}
			</Form.Item>
		) : (
			<div className="editable-cell-value-wrap" onClick={this.toggleEdit}>
				{children}
			</div>
		);
	};

	render() {
		const { editable, dataIndex, title, record, index, handleSave, children, ...restProps } = this.props;
		return (
			<td {...restProps}>
				{editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
			</td>
		);
	}
}

export default EditableCell;
