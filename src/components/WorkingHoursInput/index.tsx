import styles from './WorkingHoursInput.module.scss';

// TODO: format TBC
// TODO: handle cases with working hours after 00:00; lunch brakes; different working hours for different days of the week;
export const WORKING_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
export const DEFAULT_WORKING_DAYS = WORKING_DAYS.slice(0, 5);

type WorkingHoursInputProps = {
  label?: string;
  required?: boolean;
  error?: string;
  workFrom: string;
  workTo: string;
  workingDays: string[];
  onWorkFromChange: (value: string) => void;
  onWorkToChange: (value: string) => void;
  onWorkingDayToggle: (day: string) => void;
};

function WorkingHoursInput({
  label,
  required = false,
  error,
  workFrom,
  workTo,
  workingDays,
  onWorkFromChange,
  onWorkToChange,
  onWorkingDayToggle,
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
      <div className={styles.days} role="group" aria-label="Рабочие дни">
        <span className={styles.daysLabel}>Рабочие дни</span>
        <div className={styles.dayList}>
          {WORKING_DAYS.map((day) => {
            const selected = workingDays.includes(day);

            return (
              <label
                key={day}
                className={`${styles.day} ${selected ? styles.daySelected : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onWorkingDayToggle(day)}
                />
                {day}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WorkingHoursInput;
