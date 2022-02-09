import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styled, {css} from "styled-components";

const Board = ({children, className, calc, disabled}) => {
  const classNames = cx(
    'bb-board',
    disabled ? 'bb-board-disable' : '',
    className,
  );
  return (
    <BoardWrap className={classNames} {...{calc}}>{children}</BoardWrap>
  );
};

Board.propTypes = {
    className: PropTypes.string
};
Board.defaultProps = {
    className: ''
};

const BoardWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d6d9e5;
  border-radius: 10px;
  ${props => css`
    height: calc(100vh - ${props.calc}px)
  `}
`;

export default Board;