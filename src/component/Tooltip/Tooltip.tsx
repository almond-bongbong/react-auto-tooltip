import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import TooltipMessage from '../TooltipMessage';
import styles from './Tooltip.style.css';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import { TooltipMessageRef } from '../TooltipMessage/TooltipMessage';

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
  const [show, setShow] = useState<boolean>(false);
  const triggerElementRef = useRef<HTMLSpanElement>(null);
  const triggerElement =
    triggerElementRef.current?.children[0] || triggerElementRef.current;
  const tooltipMessageRef = useRef<TooltipMessageRef>(null);
  const prevTooltipMessageTopRef = useRef<number | null>(null);

  useUpdateEffect(() => {
    onVisible?.(show);
  }, [show]);

  useEffect(() => {
    if (visible != null) {
      setShow(visible);
    }
  }, [visible]);

  const handleOver = () => {
    setShow(visible ?? true);
    setTriggerOn(visible ?? true);
  };

  const handleOut = () => {
    setTriggerOn(visible ?? false);
  };

  const handleToggle = () => {
    if (!triggerOn) {
      setShow(visible ?? true);
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

  useLayoutEffect(() => {
    if (visible) handleOver();
  }, []);

  const handleScroll = useCallback(() => {
    if (triggerElement) {
      const triggerTop = triggerElement.getBoundingClientRect().top;

      if (
        prevTooltipMessageTopRef.current &&
        prevTooltipMessageTopRef.current != triggerTop &&
        tooltipMessageRef.current
      ) {
        tooltipMessageRef.current.update();
      }

      prevTooltipMessageTopRef.current = triggerTop;
    }
  }, [triggerElement]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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
          ref={tooltipMessageRef}
        />
      )}
    </>
  );
}

export default Tooltip;
