import React from 'react';

import {useTranslation} from "react-i18next";

const Home = () => {
  const {t} = useTranslation();
  return (
    <>
      <div className="title-md mb-15">{t('Главная страница')}</div>
    </>
  );
};

// deploy commit

export default Home;