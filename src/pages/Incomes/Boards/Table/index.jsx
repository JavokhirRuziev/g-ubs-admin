import React from 'react';
import {Board, GridElements} from "components";
import List from './list';
import {useTranslation} from "react-i18next";

const Index = ({selectedCategory}) => {
  const {t} = useTranslation();

  return (
    <GridElements.Column xs={9} gutter={10} className="Column">
      <div className="title-md mb-10">{t("Приход")}</div>
      <Board calc={160}>
        <List {...{selectedCategory}}/>
      </Board>
    </GridElements.Column>
  );
};

export default Index;
