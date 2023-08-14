import clsx from 'clsx';
import styles from './background.module.css';

export function Background() {
  return <div className={clsx(styles.gradient, 'fixed bottom-0 left-0 w-full ')} />;
}
