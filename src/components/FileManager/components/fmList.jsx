import React, {useEffect, useState} from 'react';

import {LoadMoreVisible, Spinner} from "components";
import {Search} from "components/SmallComponents";
import EntityContainer from "modules/entity/containers";

import get from "lodash/get";
import {time, helpers} from "services";
import FMUpload from "./fmUpload";
import {useDebounce} from "use-debounce";
import {Button, notification} from "antd";

const FmList = ({selected, setSelected, filterType, setLoading, isLoading}) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchQuery] = useDebounce(query, 600);

  const copyToClipboard = str => {
    var input = document.createElement('input');
    input.value = str;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);

    notification["success"]({
      message: "Упешно скопирован",
      duration: 2
    });
  };

  useEffect(() => {
   setPage(1)
  }, [filterType]);

  return (
    <EntityContainer.All
      entity="files"
      name={`allFiles-${filterType}`}
      url="/filemanager/index"
      dataKey="data"
      primaryKey="id"
      appendData={true}
      params={{
        limit: filterType === 'images' ? 20 : 6,
        sort: "-id",
        page,
        extra: {title: searchQuery},
        filter: {ext: filterType === 'images' ? ['jpg', 'jpeg', 'png', 'svg'] : ['docx', 'xsl', 'txt', 'doc', 'pdf']}
      }}>
      {({items, isFetched, meta}) => {
        return (
          <div className="fm-list__wrapper">

            <div className="fm-search">
              <Search text='Поиск действия' onSearch={setQuery} value={query} {...{ setPage }} />
            </div>

            {filterType === "images" ? (
              <div className="fm-list">
                <FMUpload {...{setLoading, isLoading, filterType}}/>
                {items.map(file => (
                  <div className={`image-file ${get(selected, 'id') === file.id ? 'selected' : ''}`} key={file.id}
                       onClick={() => setSelected(file)}>
                    {file.ext === 'svg' ? (
                      <img src={get(file, 'link')} alt="" className="image-file__item"/>
                    ) : (
                      <img src={get(file, 'thumbnails.small.src')} alt="" className="image-file__item"/>
                    )}
                    <div className="image-file__title">{get(file, 'title')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="fm-list__doc">
                <FMUpload {...{setLoading, isLoading, filterType}}/>
                {items.slice(0, 6).map(file => (
                  <div className={`doc-file ${get(selected, 'id') === file.id ? 'selected' : ''}`} key={file.id}
                       onClick={() => setSelected(file)}>
                    <div className="doc-file__item">
                      <div className="doc-file__ext">{get(file, 'ext')}</div>
                      <div className="doc-file__content">
                        <div className="doc-file__title">{get(file, 'title')}</div>
                        <div className="d-flex fs-12">
                          <div className="w-50p pr-10 d-flex">
                            {/*<div className="fw-500">Размер:</div>*/}
                            <div className="">{helpers.formatBytes(get(file, 'size'))}</div>
                          </div>
                          <div className="w-50p pl-10 d-flex">
                            {/*<div className="fw-500">Дата:</div>*/}
                            <div className="">{time.to(get(file, 'created_at'))}</div>
                          </div>
                          <div className="copy-to-clipboard">
                            <Button
                              type="primary"
                              size="small"
                              icon="copy"
                              style={{
                                marginLeft: "10px"
                              }}
                              onClick={() => copyToClipboard(file.link)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isFetched && (
              <Spinner className="md"/>
            )}

            {isFetched && meta &&
            meta.currentPage < meta.pageCount && (
              <LoadMoreVisible
                setPage={() =>
                  setPage(meta.currentPage + 1)
                }
              />
            )}
          </div>
        )
      }}
    </EntityContainer.All>
  );
};

export default FmList;
