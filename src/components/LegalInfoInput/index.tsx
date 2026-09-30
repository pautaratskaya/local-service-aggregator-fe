import styles from './LegalInfoInput.module.scss';

type LegalInfoInputProps = {
  companyName: string;
  registrationNumber: string;
  bankDetails: string;
  onCompanyNameChange: (value: string) => void;
  onRegistrationNumberChange: (value: string) => void;
  onBankDetailsChange: (value: string) => void;
  error?: string;
};

function LegalInfoInput({
  companyName,
  registrationNumber,
  bankDetails,
  onCompanyNameChange,
  onRegistrationNumberChange,
  onBankDetailsChange,
  error,
}: LegalInfoInputProps) {
  const titleText = error || 'Юридическая информация (опционально)';

  return (
    <div
      className={`${styles.legalInfoInput} ${error ? styles.errorState : ''}`}
    >
      <span className={styles.title}>{titleText}</span>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Название юр.лица/ИП</span>
        <input
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>УНП/ОГРН</span>
        <input
          value={registrationNumber}
          onChange={(e) => onRegistrationNumberChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Реквизиты</span>
        <textarea
          value={bankDetails}
          onChange={(e) => onBankDetailsChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
      </label>
    </div>
  );
}

export default LegalInfoInput;
