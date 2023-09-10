import clsx from 'clsx';
import styles from './background.module.css';

export function Background({ children }: { children: React.ReactNode }) {
  return <div className={clsx(styles.background, 'h-screen w-full')}>{children}</div>;
}
