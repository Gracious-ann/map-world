import type { Country } from '../type';
import styles from './CountryItem.module.css';
import ReactCountryFlag from 'react-country-flag';

function CountryItem({ country }: { country: Country }) {
  return (
    <li className={styles.countryItem}>
      <ReactCountryFlag
        countryCode={country.emoji}
        svg
        style={{
          width: '2.5em',
          height: '2.5em',
        }}
      />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
