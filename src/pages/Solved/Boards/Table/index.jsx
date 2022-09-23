import React from 'react';
import {GridElements} from "components";
import List from './list';

const Index = () => {
  return (
    <GridElements.Column xs={12} gutter={10} className="Column">
        <List/>
    </GridElements.Column>
  );
};

export default Index;
