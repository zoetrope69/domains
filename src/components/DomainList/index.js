import { h, Component } from 'preact';
import VirtualList from 'preact-virtual-list';

export default class DomainList extends Component {

  constructor () {
    super();

    this.rowHeight = 60;

    this.renderRow = this.renderRow.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick (e) {
    e.preventDefault();

    this.props.setCurrent(e.target.id);
  }

  renderRow (domain, index) {
    const { current } = this.props;

    const style = {
      position: 'relative',
      float: 'left',
      height: `${this.rowHeight}px`,
      lineHeight: `${this.rowHeight}px`,
      width: `${100 / 6}%`,
      overflow: 'hidden',
      color: '#383838',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: `0 ${this.rowHeight / 4}px`,
      listStyle: 'none',
      fontSize: `${this.rowHeight / 3}px`,
      borderBottom: '2px solid black',
      borderRight: '2px solid black'
    };

    if (current.domain === domain) {
      style.background = 'black';
      style.color = 'white';
    }

    return <div id={domain} onClick={this.handleRowClick} style={style}>{domain}</div>;
  }

  render () {
    const { domains } = this.props;

    const style = {
      height: '92.5vh',
      borderTop: '2px solid black',
      background: '#FFF',
      overflow: 'auto'
    };

    return (
      <VirtualList
        style={style}
        data={domains}
        renderRow={this.renderRow}
        rowHeight={this.rowHeight / 6}
        overscanCount={60}
        />
    );
  }
}
