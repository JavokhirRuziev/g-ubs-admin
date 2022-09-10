import React, {useEffect} from 'react';
import {Board, GridElements} from "components";
import List from './list';
import {useTranslation} from "react-i18next";
import moment from 'moment-timezone';


const Index = () => {
  const {t} = useTranslation();
    useEffect(() => {
        moment.tz.setDefault("Asia/Tashkent");
    }, [])
  return (
    <GridElements.Column xs={12} gutter={10} className="Column">
      <div className="title-md mb-10">{t("Приход")}</div>
      <Board calc={160}>
        <List/>
      </Board>
    </GridElements.Column>
  );
};

export default Index;
