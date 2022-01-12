import React, {
  CSSProperties,
  forwardRef,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { addRootElement } from '../../util/element';
import useForceUpdate from '../../hooks/useForceUpdate';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
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
  onClick?: () => void;
}

export interface TooltipMessageRef {
  update: () => void;
}

const containerId = 'tooltip-auto-container';
const ADJUSTMENT = 10;
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

function TooltipMessage(
  {
    triggerOn,
    message,
    zIndex = 1000,
    backgroundColor,
    style,
    className = '',
    triggerElement,
    onExited,
    onClick,
  }: TooltipMessageProps,
  ref: RefObject<TooltipMessageRef>
): ReactElement {
  const messageElementRef = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties | null>(null);
  const [tooltipArrowStyle, setTooltipArrowStyle] = useState<CSSProperties>({});
  const isFixed =
    hasWindow() &&
    triggerElement &&
    window.getComputedStyle(triggerElement).position === 'fixed';

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

  const calculatePosition = useCallback(() => {
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
        top: triggerElementRect.top + (isFixed ? 0 : window.scrollY),
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
      const scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const viewportWidth = window.innerWidth - scrollWidth;
      const isOverRight = rightEnd + ADJUSTMENT > viewportWidth;
      const isOverTop = triggerElementRect.top - messageHeight - ADJUSTMENT < 0;
      const messageRight = viewportWidth - ADJUSTMENT;
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
        tooltipArrowCalculatedStyle.right = Math.max(
          triggerOffset.width / 2 + (messageRight - triggerRight),
          10
        );
        tooltipArrowCalculatedStyle.transform = 'translateX(50%)';
      } else {
        tooltipCalculatedStyle.left = tooltipLeft;
        tooltipArrowCalculatedStyle.left = Math.max(
          triggerOffset.width / 2 + triggerOffset.left - tooltipLeft,
          10
        );
        tooltipArrowCalculatedStyle.transform = 'translateX(-50%)';
      }

      setTooltipStyle(tooltipCalculatedStyle);
      setTooltipArrowStyle(tooltipArrowCalculatedStyle);
    } else {
      setTooltipStyle({ top: -9999, left: -9999 });
      setTooltipArrowStyle({ top: -9999, left: -9999 });
    }
  }, [messageElementRef.current, triggerElement, triggerOn]);

  useIsomorphicLayoutEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  useImperativeHandle(ref, () => ({
    update: calculatePosition,
  }));

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
          {...(onClick && {
            onClick,
            tabIndex: 0,
          })}
          onClick={onClick}
          onKeyPress={(e) => {
            if (e.key === 'Enter') onClick?.();
          }}
          className={`${styles.tooltip} ${className || ''} ${
            isFixed ? styles.fixed : ''
          } ${onClick ? styles.clickable : ''}`}
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

export default forwardRef(TooltipMessage);
