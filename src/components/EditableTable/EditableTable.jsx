import "./styles.scss";

import React, { Component } from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

import EditableCell from "./EditableCell";
import EditableRow from "./EditableRow";

class EditableTable extends Component {

	static propTypes = {
		columns: PropTypes.array,
		dataSource: PropTypes.array,
		selfDataIndex: PropTypes.string,
		alwaysEditable: PropTypes.bool,
		onSave: PropTypes.func
	};
	static defaultProps = {
		columns: [],
		dataSource: [],
		onSave: () => { },
		alwaysEditable: false
	};

	render() {
		const { columns, dataSource, selfDataIndex, onSave, alwaysEditable, ...rest } = this.props;

		const components = {
			body: {
				row: EditableRow,
				cell: props => <EditableCell {...props} {...{ alwaysEditable, onSave }} />,
			},
		};
		const _columns = columns.map(col => ({
			...col,
			onCell: record => {
				if (selfDataIndex) {
					return {
						record,
						editable: col.editable,
						dataIndex: record[selfDataIndex],
						title: col.title
					}
				}
				return {
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title
				}
			}
		}));

		return (
			<Table
				{...{
					dataSource,
					components
				}}
				pagination={false}
				rowClassName={() => 'editable-row'}
				columns={_columns}
				{...rest}
			/>
		);
	}
}

export default EditableTable;