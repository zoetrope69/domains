import { h, Component } from 'preact';

export default class Domain extends Component {

  render () {
    const { current } = this.props;

    const style = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginTop: 0
    };

    return (
      <header>
        {current && current.domain && (
        <div>
          <h1 style={style} class="f3 f1-m dark-pink f-headline-l">{current.domain}</h1>

          <div class="cf">
            {current.status && (
            <dl class="db w-auto-l lh-title">
              <dd class="f6 fw4 ml0">Availability</dd>
              <dd class="f4 f-subheadline-l fw6 ml0">
                <a href={`https://domainr.com/${current.domain}`}>{current.status}</a>
              </dd>
          	</dl>
            )}

            {current.info && current.info.name && (
            <dl class="db dib-l w-auto-l lh-title">
              <dd class="f6 fw4 ml0">TLD</dd>
              <dd class="f4 f-subheadline-l fw6 ml0">{current.info.name}</dd>
          	</dl>
            )}

            {current.info && current.info.entity && (
            <dl class="db w-auto-l lh-title">
              <dd class="f6 fw4 ml0">Entity</dd>
              <dd class="f2 fw6 ml0">{current.info.entity}</dd>
          	</dl>
            )}

            {current.info && current.info.explanation && (
            <dl class="db w-auto-l lh-title">
              <dd class="f6 fw4 ml0">Explanation</dd>
              <dd class="f3 fw6 ml0">{current.info.explanation}</dd>
          	</dl>
            )}

            {current.info && current.info.notes && (
            <dl class="db w-auto-l lh-title">
              <dd class="f6 fw4 ml0">Notes</dd>
              <dd class="f4 fw6 ml0">{current.info.notes}</dd>
          	</dl>
            )}

            {current.definitions.length > 0 && (
            <dl class="db w-auto-l lh-title">
              <dd class="f6 fw4 ml0">Definitions</dd>
              <dd class="f4 fw6 ml0">
              <ul class="list">
                {current.definitions.map(definition =>
                  <li>
                    <strong>{definition.type} - </strong>
                    {definition.description}
                  </li>
                )}
              </ul>
              </dd>
          	</dl>
            )}
          </div>
        </div>
        )}
      </header>
    );
  }
}
