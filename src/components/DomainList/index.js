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

    this.props.setCurrent(e.target.innerHTML);
  }

  renderRow (domain, index) {
    const { current } = this.props;

    const style = {
      height: `${this.rowHeight}px`,
      lineHeight: `${this.rowHeight}px`,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: `${this.rowHeight / 2}px`
    };

    return (
			<li class="fl mr2" style={style}><a onClick={this.handleRowClick} href={`#${domain}`} class={`b db pa2 link mid-gray ${current.domain === domain ? ' dark-pink' : 'dim'}`}>{domain}</a></li>
	 	);
  }

  render () {
    const { domains, } = this.props;

		const style = {
			height: '85vh',
			overflow: 'auto'
		};

    return (
      <VirtualList
				class="list"
				style={style}
        data={domains}
        renderRow={this.renderRow}
        rowHeight={this.rowHeight / 6}
        overscanCount={120}
        />
    );
  }
}
