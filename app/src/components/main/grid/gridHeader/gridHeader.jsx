import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { columnPropTypes } from '../propTypes';
import { HeaderCell } from './headerCell';
import { CheckboxHeaderCell } from './checkboxHeaderCell';
import styles from './gridHeader.scss';

import { HeaderContext } from '../../scrollWrapper/scrollWrapper';

const cx = classNames.bind(styles);

const divStyle = {
  color: 'red',
  position: 'fixed',
  backgroundColor: 'cyan',
  width: '200px',
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all', // 'ms' is the only lowercase vendor prefix
};

export const GridHeader = ({
  columns,
  sortingColumn,
  sortingDirection,
  selectable,
  allSelected,
  onChangeSorting,
  onFilterClick,
  onToggleSelectAll,
  hideHeaderForMobile,
}) => (
  <HeaderContext.Consumer>
    {(headerShouldBeSticky) =>
      headerShouldBeSticky ? (
        <p style={divStyle}>NOW IT SHOULD BE STICKY</p>
      ) : (
        <p style={divStyle}>NOT STICKY</p>
      )
    }
  </HeaderContext.Consumer>
);

GridHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(columnPropTypes)),
  sortingColumn: PropTypes.string,
  sortingDirection: PropTypes.string,
  selectable: PropTypes.bool,
  allSelected: PropTypes.bool,
  hideHeaderForMobile: PropTypes.bool,
  onChangeSorting: PropTypes.func,
  onFilterClick: PropTypes.func,
  onToggleSelectAll: PropTypes.func,
};
GridHeader.defaultProps = {
  columns: [],
  sortingColumn: '',
  sortingDirection: null,
  selectable: false,
  allSelected: false,
  hideHeaderForMobile: false,
  onChangeSorting: () => {},
  onFilterClick: () => {},
  onToggleSelectAll: () => {},
};
