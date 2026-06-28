import { Link } from 'react-router-dom';
import styles from '../components/CityItem.module.css';
import ReactCountryFlag from 'react-country-flag';

interface City {
  cityName: string;
  emoji: string;
  date: string;
  id: string;
  position: {
    lat: number;
    lng: number;
  };
}

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export default function CityItem({ city }: { city: City }) {
  const { cityName, emoji, date, id, position } = city;
  console.log(city);

  return (
    <li>
      <Link
        className={styles.cityItem}
        to={`${id}?lat=${position.lat}`}
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
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}
