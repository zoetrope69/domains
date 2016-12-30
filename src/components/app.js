import { h, Component } from 'preact';

import Header from './Header';
import DomainList from './DomainList';

export default class App extends Component {
  constructor () {
    super();

    this.setCurrent = this.setCurrent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      domains: [],
      filteredDomains: [],
      current: {
        domain: '',
        start: '',
        end: '',
        status: '',
        definitions: []
      },
      search: ''
    };
  }

  componentDidMount () {
    this.getDomains();
  }

  setCurrent (domain) {
    if (!domain) {
      const newCurrent = {
        domain: '',
        start: '',
        end: '',
        status: '',
        definitions: []
      };
      this.setState({ current: newCurrent });
      return false;
    }

    const newCurrent = this.state.current;
    const domainParts = domain.split('.');
    newCurrent.domain = domain;
    newCurrent.start = domainParts[0];
    newCurrent.end = domainParts[1];
    newCurrent.status = '';
    newCurrent.definitions = [];
    this.setState({ current: newCurrent });

    this.lookupDomain(newCurrent.domain);
    this.lookupWord(newCurrent.start + newCurrent.end);
  }

  lookupWord (word) {
    fetch(`/dictionary?word=${word}`)
      .then(response => response.json())
      .then(definitions => {
        if (definitions.length <= 0 || definitions.error_message || !definitions[0].description) {
          return false;
        }

        const newCurrent = this.state.current;
        newCurrent.definitions = definitions;
        this.setState({ current: newCurrent });
      });
  }

  getDomains () {
    fetch('/domains')
      .then(response => response.json())
      .then(domains => {
        this.setState({ domains });

        this.filterDomains();
      });
  }

  lookupDomain (domain) {
    fetch(`/domainr?domain=${domain}`)
      .then(response => response.json())
      .then(response => {
        if (!response) {
          return false;
        }

        const summary = response.summary;

        const statuses = {
          'unregistrable': 'unavailable',
          'dpml': 'unavailable',
          'transferable': 'available',
          'inactive': 'available',
          'active': 'taken',
          'undelegated': 'maybe',
          'pending': 'maybe'
        };

        const status = statuses[summary] || 'unknown';

        const newCurrent = this.state.current;
        newCurrent.status = status;
        if (response.info) {
          newCurrent.info = response.info;
        }
        this.setState({ current: newCurrent });
      });
  }

  handleSearch (e) {
    e.preventDefault();

    const search = e.target.value;
    this.setState({ search });

    this.filterDomains();
  }

  filterDomains () {
    const { domains, search } = this.state;
    let filteredDomains = domains;

    // if theres a search term
    if (search.trim().length > 0) {
      if (search.includes('.')) {
        filteredDomains = filteredDomains.filter(domain => domain.includes(search.trim()));
      } else {
        filteredDomains = filteredDomains.filter(domain => domain.replace('.', '').includes(search.trim()));
      }
    }

    this.setState({ filteredDomains });
  }

  render () {
    const { filteredDomains, current, search } = this.state;

    const rootStyles = {
      fontFamily: 'sans-serif'
    };

    const filterStyles = {
      height: '7.5vh',
      overflow: 'hidden',
      fontSize: '2.5vh',
      padding: '2.5vh 15px',
      background: '#E4FFE4'
    };

    const filterInputStyles = {
      margin: '0 1em',
      font: 'inherit'
    };

    const sideStyles = {
      float: 'right',
      width: '60%',
      borderLeft: '2px solid black'
    };

    return (
      <div style={rootStyles}>
        <Header
          current={current}
          setCurrent={this.setCurrent}
          />
        <div style={sideStyles}>
          <div style={filterStyles}>
            Search:
            <input style={filterInputStyles} onInput={this.handleSearch} value={search} />
          </div>
          <DomainList
            domains={filteredDomains}
            current={current}
            setCurrent={this.setCurrent}
            />
        </div>
      </div>
    );
  }
}
