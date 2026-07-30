import { Link, useNavigate } from 'react-router-dom';
import styles from '../components/CityItem.module.css';
import ReactCountryFlag from 'react-country-flag';
import { useCityContext } from '../contexts/CityContext';
import type { City } from '../type';

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export default function CityItem({ city }: { city: City }) {
  const { currentCity, deleteCity } = useCityContext();
  const { cityName, emoji, date, id, position } = city;
  console.log(city);

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${currentCity?.id === id ? styles[`cityItem--active`] : ''}`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <ReactCountryFlag
          countryCode={city.emoji}
          svg
          style={{
            width: '2.5em',
            height: '2.5em',
          }}
        />
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.data}>{formatDate(date)}</time>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}
