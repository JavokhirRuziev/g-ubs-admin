import React, {useState} from 'react';

import {GridElements} from 'components';
import Categories from "./Boards/Categories";
import Table from "./Boards/Table";

const Index = () => {
  const [selectedCategory, setCategory] = useState(null);

  return (
    <div>
      <GridElements.Row gutter={10}>
        <Categories {...{selectedCategory, setCategory}}/>
        <Table {...{selectedCategory}}/>
      </GridElements.Row>
    </div>
  );
};

export default Index;
