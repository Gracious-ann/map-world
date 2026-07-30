import { useNavigate, useParams } from 'react-router-dom';
import styles from './City.module.css';
import ReactCountryFlag from 'react-country-flag';
import { useCityContext } from '../contexts/CityContext';
import { useEffect } from 'react';
import Spinner from './Spinner';
import Button from './Button';

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));
};

function City() {
  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCityContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (id) {
        getCity(id);
      }
    },
    [id],
  );

  // TEMP DATA
  // const currentCity = {
  //   cityName: 'Lisbon',
  //   emoji: 'PT',
  //   date: '2027-10-31T15:59:59.138Z',
  //   notes: 'My favorite city so far!',
  // };

  if (!currentCity) {
    return <Spinner />;
  }

  const { cityName, emoji, date, notes } = currentCity;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <ReactCountryFlag
            countryCode={emoji}
            svg
            style={{
              width: '2.5em',
              height: '2.5em',
            }}
          />{' '}
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target='_blank'
          rel='noreferrer'
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <Button
          type='back'
          onClick={e => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </div>
  );
}

export default City;
