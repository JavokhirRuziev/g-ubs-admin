import React from 'react';

import ProgressiveImage from "react-progressive-image";
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Link} from "react-router-dom";
import HtmlParser from "react-html-parser";

import './style.scss';

const Card = ({link, title, description, img, imgTiny, className}) => {
  const classNames = cx(
    'card',
    className,
  );
  return (
    <div className={classNames}>
      <Link to={link} className="card__img-wrap">
        <ProgressiveImage src={img} placeholder={imgTiny}>
          {(src, loading) => (
            <img
              {...{src}}
              style={{
                opacity: loading ? ".5" : "1",
                filter: loading ? "blur(10px)" : "",
                transition: ".1s",
              }}
              alt=""
            />
          )}
        </ProgressiveImage>
      </Link>
      <div className="card__body">
        <Link to={link} className="card__title">{title}</Link>
        <div className="card__text">{HtmlParser(description)}</div>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string
};
Card.defaultProps = {
  title: "Title",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem, veritatis.",
  className: ''
};

export default Card;