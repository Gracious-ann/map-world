import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import Message from './Message';
import Spinner from './Spinner';
import { useCityContext } from '../contexts/CityContext';
import type { Country } from '../type';

// interface Props {
//   cities: City[];
//   isLoading: boolean;
// }
export default function CountryList() {
  const { cities, isLoading } = useCityContext();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    );

  const countries = cities.reduce<Country[]>((arr, city) => {
    if (!arr.map(el => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    }

    return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map(country => (
        <CountryItem
          key={country.country}
          country={country}
        />
      ))}
    </ul>
  );
}
