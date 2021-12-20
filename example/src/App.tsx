import React, { ReactElement, useState } from 'react';
import { Tooltip } from 'react-auto-tooltip';
import Draggable from 'react-draggable';
import CommonHighlighter from './component/CommonHighlighter';

function App(): ReactElement {
  const [visible, setVisible] = useState<boolean>();
  // const [bottomPosition, setBottomPosition] = useState(0);

  // const handleScroll = useCallback(() => {
  //   const offsetBottom = Math.max(
  //     0,
  //     window.scrollY - (document.body.scrollHeight - window.innerHeight - 114)
  //   );
  //   setBottomPosition(offsetBottom);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [handleScroll]);

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
          <h3>Click mode</h3>
          <div className="playground">
            <Tooltip message="text message" clickMode>
              <button type="button" className="example-button">
                click me
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="text message" clickMode>
  <button type="button">
    click me
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>

        <div className="example-area">
          <h3>Default visible</h3>
          <div className="playground">
            <Tooltip message="text message" defaultVisible clickMode>
              <button type="button" className="example-button">
                hover me
              </button>
            </Tooltip>
          </div>
          <CommonHighlighter>
            {`<Tooltip message="text message" defaultVisible clickMode>
  <button type="button">
    hover me
  </button>
</Tooltip>`}
          </CommonHighlighter>
        </div>
      </div>

      <Tooltip
        visible={visible}
        message="My position is calculated automatically."
      >
        <Draggable
          onStart={() => setVisible(false)}
          onStop={() => setVisible(undefined)}
        >
          <span className="side-trigger top left">Drag Me</span>
        </Draggable>
      </Tooltip>

      {/*<Tooltip message="Hi!" visible>
        <span
          className="side-trigger test"
          style={{ transform: `translateY(-${bottomPosition}px)` }}
        >
          I'm Dog
        </span>
      </Tooltip>*/}

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
