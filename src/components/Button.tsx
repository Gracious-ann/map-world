import type { MouseEventHandler, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'primary' | 'back' | 'submit';
};

export default function Button({ children, onClick, type }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${type ? styles[type] : ''}`}
    >
      {children}
    </button>
  );
}
