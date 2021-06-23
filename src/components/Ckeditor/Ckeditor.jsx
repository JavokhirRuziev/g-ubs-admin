import React, {useRef, useState} from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-build-oks";
import cx from "classnames";
import {FileManager} from "components";

import "./style.scss";


const CkeditorField = ({ placeholder, label, className, field, form: { errors, setFieldValue, touched } }) => {
  const classNames = cx("field-container ant-row ant-form-item", touched[field.name] && errors[field.name] && "has-error", className);
  const editorEl = useRef(null);
  const [fmVisible, toggleFm] = useState(false);

  const insertImage = ({url=""}) => {
    const editor = editorEl.current.editor;
    const content = `<img src='${url}'/>`;

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
      <FileManager
          visible={fmVisible}
          onCancel={() => toggleFm(false)}
          addImage={item => {
            insertImage({url: item.domain+item.folder+item.file})
          }}
          isMulti={false}
      />
      {label && <div className="ant-label">{label}</div>}
      <CKEditor
        ref={editorEl}
        editor={ClassicEditor}
        onInit={() => {
          appendImageButton();
        }}
        config={{
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'indent',
              'outdent',
              '|',
              'imageUpload',
              'blockQuote',
              'insertTable',
              'undo',
              'redo',
              'alignment',
              'code',
              'codeBlock',
              'fontBackgroundColor',
              'fontColor',
              'fontSize',
              'fontFamily',
              'highlight',
              'horizontalLine',
              'removeFormat',
              'underline'
            ]
          },
          image: {
            // You need to configure the image toolbar, too, so it uses the new style buttons.
            toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight', 'imageStyle:alignCenter', ],

            styles: ['full','alignLeft','alignCenter','alignRight']
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableCellProperties',
              'tableProperties'
            ]
          },
          placeholder: placeholder,
          codeBlock: {
            languages: [
              { language: 'javascript', label: 'JavaScript', class: 'js javascript js-code' },
            ]
          },
          link: {
            decorators: {
              addClassStyle1: {
                mode: "manual",
                label: "Highlight link",
                attributes: {
                  class: "highlight-link"
                }
              },
              openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              }
            }
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

export default CkeditorField;
