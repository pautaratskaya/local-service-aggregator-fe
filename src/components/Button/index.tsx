import styles from './Button.module.scss';

export default function Button({
  children,
  className,
  cta = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  cta?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${styles.button} ${cta ? styles.cta : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
