import React from "react";

import ProgressiveImage from "react-progressive-image";
import PropTypes, { func, string } from "prop-types";
import cx from "classnames";
import { Link } from "react-router-dom";
// import HtmlParser from "react-html-parser";
import { ReactComponent as DeleteIcon } from "./icons/delete.svg";
import { ReactComponent as EditIcon } from "./icons/edit.svg";
import { ReactComponent as TakeProductReady } from "./icons/ready-product.svg";

import "./style.scss";

const Card = ({
	link,
	title,
	description,
	img,
	imgTiny,
	className,
	onDelete,
	onEdit,
	content,
	hasEdit,
	hasDelete,
	hasDishesProduct,
	onReadyProd
}) => {
	const classNames = cx("card", className);
	return (
		<div className={classNames}>
			<div
				style={{
					position: "absolute",
					top: 0,
					zIndex: 1,
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
					padding: "10px",
					background: "#eeeeee"
				}}>
				{hasEdit && (
					<div className="action-btn edit-btn" onClick={onEdit}>
						<EditIcon height={16} width={16} />
					</div>
				)}
				{hasDelete && (
					<div className="action-btn delete-btn" onClick={onDelete}>
						<DeleteIcon height={16} width={16} />
					</div>
				)}
				{hasDishesProduct && (
					<td style={{ width: 10 }}>
						<div
							className="action-btn confirm-btn"
							style={{ marginBottom: "5px" }}
							onClick={onReadyProd}>
							<TakeProductReady />
						</div>
					</td>
				)}
			</div>
			{img && (
				<Link to={link} className="card__img-wrap">
					<ProgressiveImage src={img} placeholder={imgTiny}>
						{(src, loading) => (
							<img
								src={src}
								style={{
									opacity: loading ? ".5" : "1",
									filter: loading ? "blur(10px)" : "",
									transition: ".1s",
									objectFit: "cover"
								}}
								alt=""
							/>
						)}
					</ProgressiveImage>
				</Link>
			)}
			<div className="card__body" style={{ marginTop: !img && "10%" }}>
				<Link to={link} className="card__title">
					{title}
				</Link>
				{/* <div className="card__text">{HtmlParser(description)}</div> */}
				<div>
					{content &&
						content.map((el, ind) => (
							<div
								style={{
									display: "flex",
									fontSize: 18,
									fontWeight: "bolder",
									justifyContent: "space-between",
									alignItems: "center"
								}}>
								<strong>{el.title}:</strong>
								<div>{el.name}</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

Card.propTypes = {
	title: PropTypes.oneOf([string, func]),
	description: PropTypes.oneOf([string, func]),
	className: PropTypes.string
};
Card.defaultProps = {
	title: "Title",
	description:
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem, veritatis.",
	className: ""
};

export default Card;
