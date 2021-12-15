import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import useLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import TooltipMessage from '../TooltipMessage';
import styles from './Tooltip.style.css';
import useUpdateEffect from '../../hooks/useUpdateEffect';

interface TooltipProps {
  children: ReactNode;
  visible?: boolean;
  message: ReactNode;
  clickMode?: boolean;
  defaultVisible?: boolean;
  zIndex?: number;
  backgroundColor?: string;
  style?: CSSProperties;
  className?: string;
  onVisible?: (visible: boolean) => void;
}

function Tooltip({
  children,
  visible,
  message,
  clickMode = false,
  defaultVisible = false,
  zIndex,
  backgroundColor,
  style,
  className,
  onVisible,
}: TooltipProps): ReactElement {
  const [triggerOn, setTriggerOn] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(visible || false);
  const triggerElementRef = useRef<HTMLSpanElement>(null);
  const triggerElement =
    triggerElementRef.current?.children[0] || triggerElementRef.current;

  useUpdateEffect(() => {
    onVisible?.(show);
  }, [show]);

  useEffect(() => {
    if (visible != null) {
      setShow(visible);
    }
  }, [visible]);

  const handleOver = () => {
    if (visible != null) return;
    setShow(true);
    setTriggerOn(true);
  };

  const handleOut = () => {
    if (visible != null) return;
    setTriggerOn(false);
  };

  const handleToggle = () => {
    if (visible != null) return;
    if (!triggerOn) {
      setShow(true);
    }
    setTriggerOn((prev) => !prev);
  };

  const handleBlur = () => {
    if (visible != null) return;
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
        {...(clickMode
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
          triggerElement={triggerElement}
          onExited={handleHide}
        />
      )}
    </>
  );
}

export default Tooltip;
