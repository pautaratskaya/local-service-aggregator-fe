import styles from './WorkingHoursInput.module.scss';

// TODO: format TBC
// TODO: handle cases with working hours after 00:00; lunch brakes; different working hours for different days of the week;
export const WORKING_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

type WorkingHoursInputProps = {
  label?: string;
  required?: boolean;
  error?: string;
  workFrom: string;
  workTo: string;
  daysOff: string[];
  onWorkFromChange: (value: string) => void;
  onWorkToChange: (value: string) => void;
  onDaysOffToggle: (day: string) => void;
};

function WorkingHoursInput({
  label,
  required = false,
  error,
  workFrom,
  workTo,
  daysOff,
  onWorkFromChange,
  onWorkToChange,
  onDaysOffToggle,
}: WorkingHoursInputProps) {
  const titleText = error || label;

  return (
    <div
      className={`${styles.workingHoursInput} ${error ? styles.errorState : ''}`}
    >
      {titleText && (
        <span className={styles.title}>
          {titleText}
          {!error && required && ' *'}
        </span>
      )}
      <div className={styles.timeRow}>
        <label className={styles.timeField}>
          <span className={styles.timeLabel}>С</span>
          <input
            type="time"
            value={workFrom}
            onChange={(e) => onWorkFromChange(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className={styles.timeField}>
          <span className={styles.timeLabel}>До</span>
          <input
            type="time"
            value={workTo}
            onChange={(e) => onWorkToChange(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
      </div>
      <div className={styles.daysOff}>
        {WORKING_DAYS.map((day) => (
          <label
            key={day}
            className={`${styles.day} ${daysOff.includes(day) ? styles.dayOff : ''}`}
          >
            <input
              type="checkbox"
              checked={daysOff.includes(day)}
              onChange={() => onDaysOffToggle(day)}
            />
            {day}
          </label>
        ))}
      </div>
    </div>
  );
}

export default WorkingHoursInput;
