import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ModalHeader.module.css';

import { classNames } from 'helpers/classNames';
import { usePlatform } from 'hooks/usePlatform';
import type { RefProps } from 'types/ref';

import { Text } from 'components/Typography/Text/Text';

export interface ModalHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Inserts a component before the header text, e.g. Icon */
  before?: ReactNode;
  /** Inserts a component after the header text, e.g. Icon */
  after?: ReactNode;
}

export const ModalHeader = ({
  ref,
  before,
  after,
  className,
  children,
  ...props
}: ModalHeaderProps & RefProps) => {
  const platform = usePlatform();

  return (
    <header
      ref={ref}
      className={classNames(styles.wrapper, className)}
      {...props}
    >
      <div className={styles.before}>{before}</div>
      {platform === 'ios' && (
        <Text
          weight="2"
          className={styles.children}
        >
          {children}
        </Text>
      )}
      <div className={styles.after}>{after}</div>
    </header>
  );
};
