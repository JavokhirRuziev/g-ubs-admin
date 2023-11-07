import React from "react";
import "./style.scss";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useTranslation } from "react-i18next";
import Form from "../../components/Fields/CustomField/Form";

const SignUp = () => {
	const { t } = useTranslation("main");
	return (
		<div className="login-page max-w-700">
			<div className="container">
				<div className="login-page__inner">
					<div className="login-box-registration">
						<div className="login-box__header">
							<div>
								<div className="login-box__title mb-10">
									{t("Регистрация")}
								</div>
								<div className="login-box__subtitle mb-10">
									{t("Панель управления G-UBS")}
								</div>
								<Link
									to={"/"}
									className="login-box__subtitle_register cursor-pointer">
									{t("Войти")}
								</Link>
							</div>
						</div>
						<div className="login-box__form">
							<Form />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
