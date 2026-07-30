// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import { useCityContext } from '../contexts/CityContext';

export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char: string) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const { lat, lng } = useUrlPosition();
  const [error, setError] = useState<string | null>(null);
  const { addNewCity, isLoading } = useCityContext();

  useEffect(() => {
    if (!lat || !lng) return;
    async function fetchCityData() {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`,
        );
        const data = await response.json();
        if (data.countryName) {
          setError(null);
        } else {
          setError('No city or country found for the given coordinates');
        }
        console.log(data);
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName || '');
        setEmoji(data.countryCode || '');
      } catch (error) {
        setError('Selection of city and country failed');
      } finally {
      }
    }
    fetchCityData();
  }, [lat, lng]);

  if (!lat || !lng) {
    return (
      <Message message='Start by clicking on the map to select a location' />
    );
  }

  if (error) {
    return <Message message={error} />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addNewCity({
      cityName,
      country: country,
      emoji: emoji,
      date: date,
      notes,
      position: {
        lat,
        lng,
      },
    });
    navigate('/app/cities');
  }
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <input
          id='date'
          type='date'
          onChange={e => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
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
    </form>
  );
}

export default Form;
