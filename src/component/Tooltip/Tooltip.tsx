import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from 'react';
import useLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import TooltipMessage from '../TooltipMessage';
import styles from './Tooltip.style.css';

interface TooltipProps {
  children: ReactNode;
  message: ReactNode;
  toggleMode?: boolean;
  defaultVisible?: boolean;
  zIndex?: number;
  backgroundColor?: string;
  style?: CSSProperties;
  className?: string;
}

function Tooltip({
  children,
  message,
  toggleMode = false,
  defaultVisible = false,
  zIndex,
  backgroundColor,
  style,
  className,
}: TooltipProps): ReactElement {
  const [triggerOn, setTriggerOn] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const triggerElementRef = useRef<HTMLSpanElement>(null);

  const handleOver = () => {
    setShow(true);
    setTriggerOn(true);
  };

  const handleOut = () => {
    setTriggerOn(false);
  };

  const handleToggle = () => {
    if (!triggerOn) {
      setShow(true);
    }
    setTriggerOn((prev) => !prev);
  };

  const handleBlur = () => {
    setTriggerOn(false);
  };

  const handleHide = () => {
    setShow(false);
  };

  useLayoutEffect(() => {
    if (defaultVisible) handleOver();
  }, []);

  return (
    <>
      <span
        ref={triggerElementRef}
        className={styles['tooltip-trigger']}
        {...(toggleMode
          ? { onClick: handleToggle, onBlur: handleBlur }
          : { onMouseOver: handleOver, onMouseOut: handleOut })}
      >
        {children}
      </span>
      {show && (
        <TooltipMessage
          triggerOn={triggerOn}
          message={message}
          zIndex={zIndex}
          backgroundColor={backgroundColor}
          style={style}
          className={className}
          triggerElement={
            triggerElementRef.current?.children[0] || triggerElementRef.current
          }
          onExited={handleHide}
        />
      )}
    </>
  );
}

export default Tooltip;
