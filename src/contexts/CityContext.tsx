import { createContext, useContext, useEffect, useReducer } from 'react';
import type { NewCity, City } from '../type';

interface CityContextType {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  getCity: (id: string) => Promise<void>;
  addNewCity: (newCity: NewCity) => void;
  deleteCity: (id: string) => void;
  error: string | null;
}

interface CityState {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  error: string | null;
}

const InitialValue: CityState = {
  cities: [],
  isLoading: false,
  currentCity: null,
  error: '',
};

function cityReducer(state: CityState, action: any): CityState {
  switch (action.type) {
    case 'setCities':
      return { ...state, cities: action.payload, isLoading: false };
    case 'setIsLoading':
      return { ...state, isLoading: true };
    case 'setCurrentCity':
      return { ...state, currentCity: action.payload, isLoading: false };
    case 'addCity':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    case 'deleteCity':
      return {
        ...state,
        cities: state.cities.filter((city: City) => city.id !== action.payload),
        currentCity: null,
        isLoading: false,
      };
    case 'setError':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}
const BASE_URL = 'http://localhost:3001';

const CityContext = createContext<CityContextType | undefined>(undefined);

const CityProvider = ({ children }: { children: React.ReactNode }) => {
  // const [cities, setCities] = useState<City[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [currentCity, setCurrentCity] = useState<City | null>(null);

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    cityReducer,
    InitialValue,
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'setIsLoading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'setCities', payload: data });
      } catch {
        dispatch({
          type: 'setError',
          payload: 'There was an error loading data...',
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id: string) {
    dispatch({ type: 'setIsLoading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'setCurrentCity', payload: data });
    } catch {
      dispatch({
        type: 'setError',
        payload: 'There was an error loading data...',
      });
    }
  }
  async function addNewCity(newCity: NewCity) {
    dispatch({ type: 'setIsLoading' });
    await fetch(`${BASE_URL}/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCity),
    }).then(res => {
      res.json().then(data => {
        if (!res.ok)
          dispatch({ type: 'setError', payload: 'Failed to add city' });
        dispatch({ type: 'addCity', payload: data });
      });
    });
  }

  async function deleteCity(id: string) {
    dispatch({ type: 'setIsLoading' });
    await fetch(`${BASE_URL}/cities/${id}`, {
      method: 'DELETE',
    }).then(res => {
      res.json().then(data => {
        if (!res.ok)
          dispatch({ type: 'setError', payload: 'Failed to delete city' });
        dispatch({ type: 'deleteCity', payload: id });
      });
    });
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        error,
        currentCity,
        getCity,
        addNewCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

function useCityContext() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}

export { useCityContext, CityProvider };
