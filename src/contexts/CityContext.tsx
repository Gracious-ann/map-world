import { createContext, useContext, useEffect, useReducer } from 'react';
import type { NewCity, City } from '../type';
import { supabase } from '../lib/supabase';

interface CityContextType {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  getCity: (id: string) => Promise<void>;
  addNewCity: (newCity: NewCity) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;
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
// const BASE_URL = 'http://localhost:3001';
supabase.from('cities').select('*');

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
        const { data, error } = await supabase.from('cities').select('*');

        if (error) {
          throw error;
        }

        dispatch({
          type: 'setCities',
          payload: data,
        });
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
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      dispatch({
        type: 'setCurrentCity',
        payload: data,
      });
    } catch {
      dispatch({
        type: 'setError',
        payload: 'There was an error loading data...',
      });
    }
  }
  async function addNewCity(newCity: NewCity) {
    dispatch({ type: 'setIsLoading' });

    try {
      const { data, error } = await supabase
        .from('cities')
        .insert(newCity)
        .select()
        .single();

      if (error) {
        throw error;
      }

      dispatch({
        type: 'addCity',
        payload: data,
      });
    } catch {
      dispatch({
        type: 'setError',
        payload: 'Failed to add city',
      });
    }
  }

  async function deleteCity(id: string) {
    dispatch({ type: 'setIsLoading' });

    try {
      const { error } = await supabase.from('cities').delete().eq('id', id);

      if (error) {
        throw error;
      }

      dispatch({
        type: 'deleteCity',
        payload: id,
      });
    } catch {
      dispatch({
        type: 'setError',
        payload: 'Failed to delete city',
      });
    }
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
