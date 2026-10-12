import { useState } from 'react';
import type { MasterRequestResponse } from '../../api/admin/listMasters';
import PhotoViewer from '../../components/PhotoViewer';
import { formatOptional } from '../../helpers';
import styles from './Admin.module.scss';

type MasterDetailsProps = {
  request: MasterRequestResponse;
};

function MasterDetails({ request }: MasterDetailsProps) {
  const { master } = request;
  const [photoOpen, setPhotoOpen] = useState(false);

  return (
    <dl className={styles.details}>
      <div>
        <dt>Имя пользователя</dt>
        <dd>{request.realName}</dd>
      </div>
      <div>
        <dt>Имя мастера</dt>
        <dd>{master.name}</dd>
      </div>
      <div>
        <dt>Телефон</dt>
        <dd>{request.phone}</dd>
      </div>
      <div>
        <dt>Специальность</dt>
        <dd>{master.speciality}</dd>
      </div>
      <div>
        <dt>Город</dt>
        <dd>{formatOptional(master.city)}</dd>
      </div>
      <div>
        <dt>Описание</dt>
        <dd>{formatOptional(master.description)}</dd>
      </div>
      {master.photoUrl && (
        <div>
          <dt>Фото</dt>
          <dd>
            <ul className={styles.photos}>
              <li>
                <button
                  type="button"
                  aria-label="Открыть фото"
                  onClick={() => setPhotoOpen(true)}
                >
                  <img src={master.photoUrl} alt="" />
                </button>
              </li>
            </ul>
            {photoOpen && (
              <PhotoViewer
                photos={[{ src: master.photoUrl }]}
                index={0}
                onClose={() => setPhotoOpen(false)}
                onIndex={() => undefined}
              />
            )}
          </dd>
        </div>
      )}
    </dl>
  );
}

export default MasterDetails;
