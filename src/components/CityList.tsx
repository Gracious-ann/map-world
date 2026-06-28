import CityItem from './CityItem';
import styles from './CityList.module.css';
import Message from './Message';
import Spinner from './Spinner';

interface City {
  id: string;
  cityName: string;
  emoji: string;
  date: any;
  [key: string]: any;
  position: {
    lat: number;
    lng: number;
  };
}

interface CityListProps {
  cities: City[];
  isLoading: boolean;
}

export default function CityList({ cities, isLoading }: CityListProps) {
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map(city => (
        <CityItem
          city={city}
          key={city.id}
        />
      ))}
    </ul>
  );
}
