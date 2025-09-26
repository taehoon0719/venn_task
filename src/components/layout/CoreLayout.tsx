import styles from './CoreLayout.module.css';

import type { PropsWithChildren } from "react";

const CoreLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles['core-layout']}>{children}</div>;
};

export default CoreLayout;
