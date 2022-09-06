import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "components";
import { DropdownMenu } from "components/SmallComponents";
import { Switch } from "antd";
import { ReactComponent as EditIcon } from "components/Table/icons/edit.svg";

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
						 hasSwitch,
						 switchHandle,
						 switchValue,
						 switchChecked,
						 children,
						 id
					 }) => {
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

			<div className="user-card__content">
				{titleLabel && <span className="fs-12 mb-5 d-block">{titleLabel}</span>}
				<span className="user-card__title">
                  {title}
                </span>
				{subtitle && (
					<span className="user-card__subtitle">{subtitle}</span>
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
