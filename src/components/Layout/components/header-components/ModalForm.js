import React from "react";
import { Spin } from "antd";
import EntityForm from "modules/entity/forms";
import Form from "./component/Form";

export default function ModalForm({ setIsOpen }) {
	// const [link, setLink] = useState();
	// useEffect(() => {
	// 	const newTab = window.open(link && link.data);
	// 	newTab && newTab.focus();
	// }, [link]);

	function openLinkInNewTab(link) {
		const newTab = window.open(link, "_blank");
		if (!newTab || newTab.closed || typeof newTab === "undefined") {
			window.location.href = link;
		}
	}

	return (
		<EntityForm.Main
			method="post"
			entity="profile"
			name="modal"
			url="/profile/payment/store"
			appendData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				// setLink(data);
				openLinkInNewTab(data.data);
				setIsOpen(false);
			}}
			fields={[
				{ name: "payment_type", required: true },
				{ name: "amount", required: true, min: 3, max: 7 }
			]}>
			{({ isSubmitting }) => {
				return (
					<Spin spinning={isSubmitting}>
						<Form />
					</Spin>
				);
			}}
		</EntityForm.Main>
	);
}
