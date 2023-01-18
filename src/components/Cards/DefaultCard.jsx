import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "components";
import { DropdownMenu } from "components/SmallComponents";
import {Modal, notification, Switch} from "antd";
import { ReactComponent as EditIcon } from "components/Table/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "components/Table/icons/delete.svg";
import Actions from "../../modules/entity/actions";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import qs from "query-string";
import {useHistory} from "react-router";

const DefaultCard = ({
						 modelId,
						 image,
						 hasImage,
						 title,
						 subtitle,
						 titleLabel,
						 menuList,
						 className,
						 hasBadge,
						 model,
						 onClick,
						 onEdit,
						 onDelete,
						 hasSwitch,
						 switchHandle,
						 switchValue,
						 switchChecked,
						 children,
						 id
					 }) => {

	const {t} = useTranslation("main");
	const dispatch = useDispatch();
	const history = useHistory();

	const onDeleteHandler = modelId => {
		console.log(modelId);
		Modal.confirm({
			title: t("Вы действительно хотите очистить все транзакции?"),
			okText: t("да"),
			okType: "danger",
			cancelText: t("нет"),
			confirmLoading: true,
			onOk: () => deleteAction(modelId)
		});
	};
	const deleteAction = id => {
		dispatch(Actions.Form.request({
			method: "delete",
			entity: "incomes",
			id: id,
			url: `/transactions/category/${id}`,
			deleteData: true,
			primaryKey: "id",
			cb: {
				success: () => {
					notification["success"]({
						message: t("Успешно удалена"),
						duration: 2
					});
					history.push({
						search: qs.stringify({category_id:id})
					});
				},
				error: () => {
					notification["error"]({
						message: t("Что-то пошло не так"),
						duration: 2
					});
				},
				finally: () => { }
			}
		}));
	};


	return (
		<div className={`bb-card user-card ${className}`} id={id ? id : null}>
			{onClick && (
				<div className="bb-card__click-handler" onClick={onClick} />
			)}
			{hasImage && (
				<Avatar className="mr-15" image={image} hasBadge={hasBadge} onClick={onClick} />
			)}
			{hasSwitch && (
				<div className={`mr-20 ${switchValue === 1 ? "half" : ""}`}>
					<Switch
						onChange={value => switchHandle(value, modelId)}
						checked={switchChecked}
						value={switchValue}
					/>
				</div>
			)}

			<div className="user-card__content d-flex align-items-center justify-content-between w-100p">
				{titleLabel && <span className="fs-12 mb-5 d-block">{titleLabel}</span>}
				<span className="user-card__title">
                  {title}
                </span>
				{subtitle && (
					<span className="user-card__subtitle">{subtitle}</span>
				)}
				{onDelete && (
					<div
						className="action-btn cursor-pointer"
						onClick={() => onDeleteHandler(modelId)}
						style={{zIndex: 2,position:"relative"}}
					>
						<DeleteIcon className="d-block" height={16} width={16} />
					</div>
				)}
				{onEdit && (
					<div
						className="action-btn edit-btn"
						onClick={onEdit}
					>
						<EditIcon height={16} width={16} />
					</div>
				)}
				{children}
			</div>

			{(menuList.length > 0) && (
				<div className="card__more-btn">
					<DropdownMenu key="more" {...{ model, menuList }} />
				</div>
			)}
		</div>
	);
};

DefaultCard.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	titleLabel: PropTypes.string,
	image: PropTypes.string,
	subtitle: PropTypes.string,
	moreMenu: PropTypes.array,
	hasBadge: PropTypes.bool,
	hasImage: PropTypes.bool,
	model: PropTypes.object,
	switchHandle: PropTypes.func
};
DefaultCard.defaultProps = {
	className: "",
	menuList: [],
	hasBadge: false,
	hasImage: false,
	hasSwitch: false,
	model: {},
	switchValue: 0,
	switchChecked: false,
	switchHandle: () => {
	}
};

export default DefaultCard;
