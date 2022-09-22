import React from 'react';
import {GridElements} from "components";
import List from './list';

const Index = ({selectedCategory}) => {

  return (
    <GridElements.Column xs={9} gutter={10} className="Column">
        <List {...{selectedCategory}}/>
    </GridElements.Column>
  );
};

export default Index;
