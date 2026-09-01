import { type InputHTMLAttributes, useEffect, useId, useMemo } from 'react';
import { CrossIcon } from '../../icons';
import styles from './FileInput.module.scss';

type FileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value'
> & {
  label?: string;
  error?: string;
  required?: boolean;
  files?: File[];
  onFileRemove?: (index: number) => void;
};

function FileInput({
  label,
  error,
  required = false,
  files = [],
  onFileRemove,
  onChange,
  ...inputProps
}: FileInputProps) {
  const inputId = useId();
  const titleText = error || label;
  const pickButtonText = files.length > 0 ? 'Добавить фото' : 'Выбрать фото';

  const previewItems = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previewItems.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previewItems]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    event.target.value = '';
  };

  return (
    <div
      className={`${styles.fileInput} ${titleText ? styles.withTitle : ''} ${error ? styles.errorState : ''}`}
    >
      {titleText && (
        <span className={styles.title}>
          {titleText}
          {!error && required && ' *'}
        </span>
      )}
      <input
        id={inputId}
        type="file"
        className={styles.hiddenInput}
        {...inputProps}
        onChange={handleChange}
        aria-invalid={Boolean(error)}
      />
      <label htmlFor={inputId} className={styles.pickButton}>
        {pickButtonText}
      </label>
      {previewItems.length > 0 && (
        <ul
          className={styles.previewList}
          aria-label="Превью загруженных файлов"
        >
          {previewItems.map(({ file, url }, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${file.size}-${index}`}
              className={styles.previewItem}
            >
              <img src={url} alt={file.name} className={styles.previewImage} />
              {onFileRemove && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onFileRemove(index)}
                  aria-label={`Удалить ${file.name}`}
                >
                  <CrossIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <p className={styles.meta}>Загружено: {files.length}</p>
      )}
    </div>
  );
}

export default FileInput;
