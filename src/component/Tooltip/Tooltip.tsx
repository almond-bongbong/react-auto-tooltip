import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import TooltipMessage, {
  TooltipMessageRef,
} from '../TooltipMessage/TooltipMessage';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';

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
  onClickMessage?: () => void;
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
  onClickMessage,
}: TooltipProps): ReactElement {
  const [triggerOn, setTriggerOn] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const triggerElementRef = useRef<HTMLSpanElement>(null);
  const triggerElement =
    triggerElementRef.current?.children[0] || triggerElementRef.current;
  const tooltipMessageRef = useRef<TooltipMessageRef>(null);
  const prevTooltipMessageTopRef = useRef<number | null>(null);
  const detectAnimationFrameRef = useRef<number | null>(null);
  const renderTooltip = show && (visible == null || visible);

  useUpdateEffect(() => {
    onVisible?.(show);
  }, [show]);

  const handleOver = useCallback(() => {
    setShow(visible ?? true);
    setTriggerOn(visible ?? true);
  }, [visible]);

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

  useIsomorphicLayoutEffect(() => {
    if (defaultVisible) handleOver();
  }, [defaultVisible, handleOver]);

  useIsomorphicLayoutEffect(() => {
    if (visible && (!show || !triggerOn)) handleOver();
  }, [visible, handleOver]);

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

  const detectTrigger = useCallback(() => {
    tooltipMessageRef.current?.update();
    detectAnimationFrameRef.current = requestAnimationFrame(detectTrigger);
  }, []);

  useEffect(() => {
    if (renderTooltip) {
      detectAnimationFrameRef.current = requestAnimationFrame(detectTrigger);
    }

    return () => {
      if (detectAnimationFrameRef.current) {
        cancelAnimationFrame(detectAnimationFrameRef.current);
      }
    };
  }, [detectTrigger, renderTooltip]);

  const triggerProps = {
    ref: triggerElementRef,
    ...(clickMode
      ? { onClick: handleToggle, onBlur: handleBlur }
      : { onMouseOver: handleOver, onMouseOut: handleOut }),
  };

  return (
    <>
      <span {...triggerProps}>{children}</span>
      {renderTooltip && (
        <TooltipMessage
          ref={tooltipMessageRef}
          triggerOn={triggerOn}
          message={message}
          zIndex={zIndex}
          backgroundColor={backgroundColor}
          style={style}
          className={className}
          triggerElement={triggerElement}
          onExited={handleHide}
          onClick={onClickMessage}
        />
      )}
    </>
  );
}

export default Tooltip;
