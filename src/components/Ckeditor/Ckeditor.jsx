import React, {useRef, useState} from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor-custom-ckeditor5-build-classic-with-plenty-add-features";
import cx from "classnames";
import {FileManager} from "components";

import "./style.scss";


const Ckeditor = ({ placeholder, label, className, field, form: { errors, setFieldValue, touched } }) => {
  const classNames = cx("field-container ant-row ant-form-item", touched[field.name] && errors[field.name] && "has-error", className);
  const editorEl = useRef(null);
  const [fmVisible, toggleFm] = useState(false);

  const insertImage = ({url="", alt=""}) => {
    const editor = editorEl.current.editor;
    const content = `<img src='${url}' alt='${alt}'/>`;

    const viewFragment = editor.data.processor.toView( content );
    const modelFragment = editor.data.toModel( viewFragment );
    editor.model.insertContent( modelFragment );
  };

  const appendImageButton = () => {
    const btn = document.createElement('div');
    btn.className = 'image-upload-btn';
    btn.onclick=() => toggleFm(true);
    const selector = document.querySelector('.ck-file-dialog-button');
    selector.appendChild(btn);
  };
	
	

  return (
		<div className={classNames}>
			<FileManager visible={fmVisible} onCancel={() => toggleFm(false)} addImage={insertImage} />

			<div className="d-flex align-items-center justify-content-between">
        {label && <div className="ant-label">{label}</div>}
			</div>

			<CKEditor
				ref={editorEl}
				editor={ClassicEditor}
				onInit={() => {
					appendImageButton();
				}}
				config={{
					placeholder: placeholder,
					link: {
						decorators: {
							checkClass: {
								mode: "automatic",
								callback: function(url) {
									setTimeout(function() {
										// valid class list
										var validClassList = ["style1", "style2"];

										// var linkElement = $(".ck.ck-content").find("a[href*='" + url + "']");
										var content = document.querySelector(".ck.ck-content");
										var linkElement = content && content.querySelector("a[href*='" + url + "']");

										// split the linked class in the current link
										// var splitClass = linkElement.attr("class").split(" ");
										var splitClass = linkElement && linkElement.getAttribute("class").split(" ");

										var commonClass =
											validClassList &&
											validClassList.filter(value => -1 !== (splitClass && splitClass.indexOf(value)));

										if (commonClass.length) linkElement && linkElement.classList.remove("defaultClass");
										else linkElement && linkElement.classList.add("defaultClass");
									}, 500);

									return true;
								},
								attributes: {
									class: "defaultClass"
								}
							},
							addClassStyle1: {
								mode: "manual",
								label: "Custom",
								attributes: {
									class: "highlight-link"
								}
							},
							addClassStyle2: {
								mode: "manual",
								label: "Custom-2",
								attributes: {
									class: "custom-link-2"
								}
							}
						}
					},
          image: {
            // You need to configure the image toolbar, too, so it uses the new style buttons.
            toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight', 'imageStyle:alignCenter', ],

            styles: ['full','alignLeft','alignCenter','alignRight']
          }
				}}
				data={field.value}
				onChange={(event, editor) => {
					setFieldValue(field.name, editor.getData());
				}}
			/>

			{touched[field.name] && errors[field.name] && <div className="ant-form-explain">{errors[field.name]}</div>}
		</div>
  );
};

export default Ckeditor;
