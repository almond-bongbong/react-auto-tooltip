import React, { ReactElement } from 'react';
import { Tooltip } from 'react-auto-tooltip';
import CommonHighlighter from './component/CommonHighlighter';

function App(): ReactElement {
  return (
    <>
      <div className="container">
        <h2 id="tooltip">Tooltip</h2>
        <p>The position of the tooltip is calculated automatically.</p>

        <h3>Basic usage</h3>
        <div className="example-area">
          <div className="playground">
            <Tooltip
              message="text message"
              onVisible={(visible) => console.log(visible)}
            >
              hover me
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="text message">hover me</Tooltip>`}
          </CommonHighlighter>
        </div>

        <div className="example-area">
          <div className="playground">
            <Tooltip message="text message">
              <button type="button" className="example-button">
                hover me
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="text message">
  <button type="button">
    hover me
  </button>
️</Tooltip>`}
          </CommonHighlighter>
        </div>

        <div className="example-area">
          <h3>Custom style</h3>
          <div className="playground">
            <Tooltip message="My custom tooltip" backgroundColor="blue">
              <button type="button" className="example-button">
                text message
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="My custom tooltip" backgroundColor="blue">
  <button type="button" className="example-button">
    text message
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>

        <div className="example-area">
          <h3>Toggle mode</h3>
          <div className="playground">
            <Tooltip message="text message" toggleMode>
              <button type="button" className="example-button">
                click me
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="text message" toggleMode>
  <button type="button">
    click me
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>

        <div className="example-area">
          <h3>Default visible</h3>
          <div className="playground">
            <Tooltip message="text message" defaultVisible>
              <button type="button" className="example-button">
                hover me
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="text message" defaultVisible>
  <button type="button">
    hover me
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>
      </div>

      <div className="trigger-list">
        <Tooltip message="text message">
          <span className="side-trigger top left">hover me</span>
        </Tooltip>
        <Tooltip message="text message">
          <span className="side-trigger top center">hover me</span>
        </Tooltip>
        <Tooltip message="text message">
          <span className="side-trigger top right">hover me</span>
        </Tooltip>
        <Tooltip message="text message">
          <span className="side-trigger bottom left">hover me</span>
        </Tooltip>
        <Tooltip message="text message">
          <span className="side-trigger bottom center">hover me</span>
        </Tooltip>
        <Tooltip message="text message">
          <span className="side-trigger bottom right">hover me</span>
        </Tooltip>
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
    </>
  );
}

export default App;
