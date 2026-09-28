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
  return (
    <div className={styles.legalInfoInput}>
      <fieldset className={styles.legal}>
        <legend>Юридическая информация (опционально)</legend>
        <label>
          Название юр.лица/ИП
          <input
            className={styles.control}
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
          />
        </label>
        <label>
          УНП/ОГРН
          <input
            className={styles.control}
            value={registrationNumber}
            onChange={(e) => onRegistrationNumberChange(e.target.value)}
          />
        </label>
        <label>
          Реквизиты
          <textarea
            className={styles.control}
            value={bankDetails}
            onChange={(e) => onBankDetailsChange(e.target.value)}
          />
        </label>
      </fieldset>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default LegalInfoInput;
