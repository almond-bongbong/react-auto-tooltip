import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { addRootElement } from '../../util/element';
import useForceUpdate from '../../hooks/useForceUpdate';
import useLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { newLineToBreakTag } from '../../util/string';
import { hasWindow } from '../../util/browser';
import Portal from '../Portal';
import styles from './TooltipMessage.style.css';

interface TooltipMessageProps {
  triggerOn: boolean;
  message: ReactNode;
  zIndex?: number;
  backgroundColor?: string;
  style?: CSSProperties;
  className?: string;
  triggerElement: Element | null;
  onExited: () => void;
}

const containerId = 'tooltip-auto-container';
const ADJUSTMENT = 15;
const getArrowBottomStyleWithColor = (
  arrowColor: string = 'rgba(0, 0, 0, 0.8)'
): CSSProperties => ({
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: `5px solid ${arrowColor}`,
});
const getArrowTopStyleWithColor = (
  arrowColor: string = 'rgba(0, 0, 0, 0.8)'
): CSSProperties => ({
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderBottom: `5px solid ${arrowColor}`,
});

const calcTop = (triggerTop: number, messageHeight: number) =>
  triggerTop - messageHeight - ADJUSTMENT;
const calcBottom = (triggerTop: number, triggerHeight: number) =>
  triggerTop + triggerHeight + ADJUSTMENT;
const calcLeft = (
  triggerLeft: number,
  triggerWidth: number,
  messageWidth: number
) => Math.max(triggerLeft - (messageWidth - triggerWidth) / 2, ADJUSTMENT);

function TooltipMessage({
  triggerOn,
  message,
  zIndex = 1000,
  backgroundColor,
  style,
  className = '',
  triggerElement,
  onExited,
}: TooltipMessageProps): ReactElement {
  const messageElementRef = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties | null>(null);
  const [tooltipArrowStyle, setTooltipArrowStyle] = useState<CSSProperties>({});

  if (hasWindow() && !document.getElementById(containerId)) {
    addRootElement(containerId);
  }

  const handleExited = () => {
    if (!triggerOn) onExited();
  };

  useEffect(() => {
    if (hasWindow()) document.addEventListener('resize', forceUpdate);
    return () => {
      if (hasWindow()) document.removeEventListener('resize', forceUpdate);
    };
  }, []);

  useLayoutEffect(() => {
    const messageElement = messageElementRef.current;

    if (
      hasWindow() &&
      messageElement &&
      messageElement.offsetTop &&
      triggerElement
    ) {
      const tooltipBackgroundColor = window
        .getComputedStyle(messageElement, null)
        .getPropertyValue('background-color');
      const messageWidth = messageElement.offsetWidth;
      const messageHeight = messageElement.offsetHeight;
      const triggerElementRect = triggerElement.getBoundingClientRect();
      const triggerOffset = triggerElementRect && {
        top: triggerElementRect.top + window.scrollY,
        left: triggerElementRect.left + window.scrollX,
        width: triggerElementRect.width,
        height: triggerElementRect.height,
      };
      const triggerTop = triggerOffset.top;
      const triggerLeft = triggerOffset.left;
      const triggerWidth = triggerOffset.width;
      const triggerHeight = triggerOffset.height;
      const rightEnd =
        Math.round(triggerLeft - messageWidth / 2 + triggerWidth / 2) +
        messageWidth;
      const isOverRight = rightEnd + ADJUSTMENT > window.innerWidth;
      const isOverTop = triggerElementRect.top - messageHeight - ADJUSTMENT < 0;
      const messageRight = window.innerWidth - ADJUSTMENT;
      const triggerRight = triggerLeft + triggerWidth;
      const tooltipLeft = calcLeft(triggerLeft, triggerWidth, messageWidth);
      let tooltipCalculatedStyle: CSSProperties = {};
      let tooltipArrowCalculatedStyle: CSSProperties;

      if (isOverTop) {
        tooltipCalculatedStyle.top = calcBottom(triggerTop, triggerHeight);
        tooltipArrowCalculatedStyle = {
          top: -5,
          ...getArrowTopStyleWithColor(tooltipBackgroundColor),
        };
      } else {
        tooltipCalculatedStyle.top = calcTop(triggerTop, messageHeight);
        tooltipArrowCalculatedStyle = {
          bottom: -5,
          ...getArrowBottomStyleWithColor(tooltipBackgroundColor),
        };
      }

      if (isOverRight) {
        tooltipCalculatedStyle.right = ADJUSTMENT;
        tooltipArrowCalculatedStyle.right =
          triggerOffset.width / 2 + (messageRight - triggerRight);
        tooltipArrowCalculatedStyle.transform = 'translateX(50%)';
      } else {
        tooltipCalculatedStyle.left = tooltipLeft;
        tooltipArrowCalculatedStyle.left =
          triggerOffset.width / 2 + triggerOffset.left - tooltipLeft;
        tooltipArrowCalculatedStyle.transform = 'translateX(-50%)';
      }

      setTooltipStyle(tooltipCalculatedStyle);
      setTooltipArrowStyle(tooltipArrowCalculatedStyle);
    } else {
      setTooltipStyle({ top: -9999, left: -9999 });
      setTooltipArrowStyle({ top: -9999, left: -9999 });
    }
  }, [messageElementRef.current, triggerElement, triggerOn]);

  return (
    <Portal selector={`#${containerId}`}>
      <CSSTransition
        timeout={300}
        in={triggerOn}
        appear
        onExited={handleExited}
        nodeRef={messageElementRef}
      >
        <div
          ref={messageElementRef}
          className={`${styles['tooltip']} ${className || ''}`}
          style={{
            ...tooltipStyle,
            ...style,
            ...(zIndex && { zIndex }),
            ...(backgroundColor && { backgroundColor }),
          }}
        >
          {typeof message === 'string' ? newLineToBreakTag(message) : message}
          <span className={styles['arrow']} style={tooltipArrowStyle} />
        </div>
      </CSSTransition>
    </Portal>
  );
}

export default TooltipMessage;
