import React from 'react';

import {GridElements} from 'components';
import Table from "./Boards/Table";

const Index = () => {
  return (
    <div>
      <GridElements.Row gutter={10}>
        <Table/>
      </GridElements.Row>
    </div>
  );
};

export default Index;
