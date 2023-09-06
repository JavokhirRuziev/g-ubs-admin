import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Breadcrumb } from "components";
import defaultAvatar from "assets/images/icons/user.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import config from "config";
import systemActions from "store/actions/system";
import { thousandsDivider } from "../../../services/thousandsDivider";
import ModalForm from "./header-components/ModalForm";
import { Modal } from "antd";

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const currentLangCode = useSelector(state => state.system.currentLangCode);
	const currentLangTitle = config.API_LANGUAGES.find(
		l => l.code === currentLangCode
	).title;
	const dispatch = useDispatch();
	const profile = useSelector(state => state.auth.data);
	const { t } = useTranslation("main");
	const changeLang = langCode => {
		i18next.changeLanguage(langCode);
		dispatch(systemActions.ChangeLanguage(langCode));
	};

	return (
		<>
			<Modal
				visible={isOpen}
				onOk={() => setIsOpen(true)}
				onCancel={() => setIsOpen(false)}
				footer={null}
				centered
				width={430}
				destroyOnClose>
				<ModalForm setIsOpen={setIsOpen} />
			</Modal>

			<div className="m-header">
				<div className="m-header-wrapper">
					<div className="d-flex align-items-center">
						<Breadcrumb className="mb-0 bb-breadcrumb--outline" />
					</div>
					<div className="check">
						<p className="mb-0">
							{thousandsDivider(get(profile, "success.balance"))}{" "}
							{t("сум")}
						</p>
						<div
							onClick={() => setIsOpen(true)}
							className={"payment_dropdown_label ml-15"}>
							{t("Оплатить")}
						</div>
					</div>
					<div className="d-flex align-items-center">
						<div className="cm-dropdown">
							<div className="cm-dropdown-label">
								{t(currentLangTitle)}
							</div>
							<div className="cm-dropdown-list-wrapper">
								<div className="cm-dropdown-list">
									{config.API_LANGUAGES.map(lang => (
										<span
											className="cm-dropdown-item"
											key={lang.id}
											onClick={() =>
												changeLang(lang.code)
											}>
											{t(lang.title)}
										</span>
									))}
								</div>
							</div>
						</div>
						<div className="profile-dropdown cm-dropdown">
							<div className="profile-dropdown-avatar">
								<img src={defaultAvatar} alt="" />
							</div>
							<div className="cm-dropdown-list-wrapper">
								<div className="cm-dropdown-list">
									<Link
										to={"/profile"}
										className="cm-dropdown-item">
										{t("Профил")}
									</Link>
									<Link
										to={"/logout"}
										className="cm-dropdown-item">
										{t("Выход")}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;
