import React, { Fragment, ReactElement } from 'react';
import { Tooltip } from 'react-auto-tooltip';
import CommonHighlighter from './component/CommonHighlighter';

function App(): ReactElement {
  return (
    <Fragment>
      <div className="container">
        <header>
          <div className="header-content">
            <h1>react-auto-tooltip</h1>
          </div>
        </header>
        <h2 id="tooltip">Tooltip</h2>
        <p>The position of the tooltip is calculated automatically.</p>
        <div className="example-area">
          <h3>Basic usage</h3>
          <div className="playground" style={{ position: 'relative' }}>
            <Tooltip message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. \n Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.">
              <button type="button" className="example-button">
                Magic tooltip message
              </button>
              ️
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. \\n Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.">
  <button type="button" className="example-button">
    Magic tooltip message
  </button>
️</Tooltip>`}
          </CommonHighlighter>
        </div>
        <div className="example-area">
          <h3>Custom style</h3>
          <div className="playground">
            <Tooltip
              message="My custom tooltip"
              messageStyle={{
                backgroundColor: 'rgba(50, 130, 184, 0.9)',
                fontSize: 16,
              }}
              messageClassName="my-tooltip-message"
            >
              <button type="button" className="example-button">
                Magic tooltip message
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip
  message="My custom tooltip"
  messageStyle={{ backgroundColor: 'rgba(50, 130, 184, 0.9)', fontSize: 16 }}
  messageClassName="my-tooltip-message"
>
  <button type="button" className="example-button">
    Magic tooltip message
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>

        <div className="example-area">
          <h3>Toggle type</h3>
          <div className="playground">
            <Tooltip message="Basic tooltip message" toggle>
              <button type="button" className="example-button">
                Magic tooltip message
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="Basic tooltip message" toggle>
  <button type="button" className="example-button">
    Magic tooltip message
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>
      </div>

      <footer>
        <div className="footer-content">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/almond-bongbong"
          >
            https://github.com/almond-bongbong
          </a>
        </div>
      </footer>
    </Fragment>
  );
}

export default App;
