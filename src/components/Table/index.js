import React from "react";

import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { compose } from "recompose";
import { Table, Tooltip } from "antd";

import { ReactComponent as DeleteIcon } from "./icons/delete.svg";
import { ReactComponent as EditIcon } from "./icons/edit.svg";
import { ReactComponent as ConfirmIcon } from "./icons/confirm.svg";

import "./style.scss";

const propTypes = {
  hasConfirm: PropTypes.bool,
  hasEdit: PropTypes.bool,
  hasDelete: PropTypes.bool,

  onConfirm: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,

  onChange: PropTypes.func,
  pagination: PropTypes.bool,
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  rowSelection: PropTypes.object,
};
const defaultProps = {
  hasConfirm: false,
  hasEdit: false,
  hasDelete: false,

  onConfirm: () => {},
  onEdit: () => {},
  onDelete: () => {},

  onChange: () => {},
  pagination: false,
  columns: [],
  dataSource: [],
};

function TableWithActions(props) {
  const {
    t,
    hasConfirm,
    hasEdit,
    hasDelete,

    onConfirm,
    onEdit,
    onDelete,

    onChange,
    pagination,
    columns,
    dataSource,
    rowSelection,
    rowKey,

    ...rest
  } = props;

  const components = {
    header: {
      row: props => {
        return (
          <tr {...props}>
            {props.children}
            {hasConfirm && <th className={props.children[0].className} style={{ width: 10 }} />}
            {hasEdit && <th className={props.children[0].className} style={{ width: 10 }} />}
            {hasDelete && <th className={props.children[0].className} style={{ width: 10 }} />}
          </tr>
        );
      }
    },
    body: {
      row: row => {
        const item = dataSource.find(item => item[rowKey] === row["data-row-key"]);
        return (
          <tr {...row}>
            {row.children}
            {hasConfirm && (
              <td style={{ width: 10 }}>
                <Tooltip title={t("Подтвердить")}>
                  <div className="action-btn confirm-btn" onClick={() => onConfirm(item)}>
                    <ConfirmIcon height={16} width={16} />
                  </div>
                </Tooltip>
              </td>
            )}
            {hasEdit && (
              <td style={{ width: 10 }}>
                <Tooltip title={t("Редактировать")}>
                  <div className="action-btn edit-btn" onClick={() => onEdit(item)}>
                    <EditIcon height={16} width={16} />
                  </div>
                </Tooltip>
              </td>
            )}
            {hasDelete && (
              <td style={{ width: 10 }}>
                <Tooltip title={t("Удалить")}>
                  <div className="action-btn delete-btn" onClick={() => onDelete(item)}>
                    <DeleteIcon height={16} width={16} />
                  </div>
                </Tooltip>
              </td>
            )}
          </tr>
        );
      }
    }
  };

  return (
    <Table
      {...{
        components,
        onChange,
        pagination,
        columns,
        dataSource,
        rowSelection,
        rowKey,
        ...rest
      }}
    />
  );
}

TableWithActions.propTypes = propTypes;
TableWithActions.defaultProps = defaultProps;

export default compose(withTranslation("main"))(TableWithActions);
