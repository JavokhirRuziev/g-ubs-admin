import React, {Component} from 'react';
import PropTypes from 'prop-types';
import avatar from './avatar.svg';
import pattern from "assets/images/pattern.jpg";
import './Avatar.scss';
import cx from "classnames";

class Avatar extends Component {

  static defaultProps = {
    size: 'md',
    className: '',
    hasBadge: false,
    isProduct: false
  };

  static propTypes = {
    size:  PropTypes.oneOf(['lg', 'sm', 'xs', 'md']),
    className: PropTypes.string,
    image: PropTypes.string,
    hasBadge: PropTypes.bool,
    isProduct: PropTypes.bool
  };

  render() {

    const { className, size, image, hasBadge, isProduct, isRectangle } = this.props;

    const classNames = cx(
      'avatar',
      `avatar--${size}`,
      isRectangle ? 'avatar--rectangle' : '',
      className,
    );

    return (
      <div className={classNames}>

        {isProduct ? (
          <img src={image ? image : pattern} alt=""/>
        ) : (
          <img src={image ? image : avatar} alt=""/>
        )}

        {
          hasBadge ? <span className='avatar__badge' /> : null
        }

      </div>
    );
  }
}

export default Avatar;