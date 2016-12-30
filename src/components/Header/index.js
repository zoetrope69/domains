import { h, Component } from 'preact';

export default class Header extends Component {

  constructor () {
    super();

    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
  }

  handleCloseButtonClick (e) {
    e.preventDefault();

    this.props.setCurrent(false);
  }

  render () {
    const { current } = this.props;

    const styles = {
      float: 'left',
      width: '40%',
      height: '100vh',
      padding: '15px'
    };

    const titleStyles = {
      fontSize: '4em'
    };

    return (
      <header style={styles}>
        {current && current.domain && (
        <div>
          <h1 style={titleStyles}><a href={`https://domainr.com/${current.domain}`}>{current.domain}</a></h1>

          {current.status && (
          <p>
            <strong>domain avaibility</strong><br />
            {current.status}
          </p>
          )}

          {current.info && (
          <p>
            <strong>domain info</strong><br />
            {current.info.name}<br />
            {current.info.entity}<br />
            {current.info.explanation}<br />
            {current.info.notes}<br />
          </p>
          )}

          {current.definitions.length > 0 && (
          <p>
            <strong>definitions</strong><br />
            <ul>
              {current.definitions.map(definition =>
                <li>
                  <strong>{definition.type} - </strong>
                  {definition.description}
                </li>
              )}
            </ul>
          </p>
          )}

          <button onClick={this.handleCloseButtonClick}>Close</button>
        </div>
        )}
      </header>
    );
  }
}
