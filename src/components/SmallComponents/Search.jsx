import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';

const Search = ({ className, text, onSearch, value, setPage = () => {}}) => {
  return (
    <SearchInput className={className}>
      <input type='search' onChange={e => {
        onSearch(e.target.value);
        setPage(1);
      }} placeholder={text} value={value} />
      <Icon type='search' />
    </SearchInput>
  );
};

export default Search;

const SearchInput = styled.div`
	display: flex;
	align-items: center;
	height: 40px;
	min-width:220px;
	border-radius: 4px;
	border: solid 1px rgb(210, 210, 210);
	position: relative;
	overflow: hidden;
	input {
		width: 100%;
		background-color: transparent;
		display: inline-block;
		height: 100%;
		line-height: 40px;
		outline: none 0;
		padding: 0 30px 0 10px;
		border: none 0;
	}
	.anticon-search {
		position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
	}
	
`;
