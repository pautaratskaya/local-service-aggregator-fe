import type { ReactNode } from 'react';
import styles from './IllustratedMessage.module.scss';

interface IllustratedMessageProps {
  image?: string;
  imageAlt?: string;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  centered?: boolean;
}

function IllustratedMessage({
  image,
  imageAlt,
  title,
  description,
  children,
  centered = false,
}: IllustratedMessageProps) {
  return (
    <div
      className={`${styles.illustratedMessage} ${centered ? styles.centered : ''}`}
    >
      {image && (
        <img className={styles.illustration} src={image} alt={imageAlt} />
      )}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {children}
    </div>
  );
}

export default IllustratedMessage;
