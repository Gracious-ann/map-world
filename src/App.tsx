import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import AppLayout from './pages/AppLayout';
import PageNotFound from './pages/PageNotFound';
import CountryList from './components/CountryList';
import CityList from './components/CityList';
import Form from './components/Form';
import City from './components/City';
import { CityProvider } from './contexts/CityContext';
import { AuthProvider } from './contexts/FakeAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={<Homepage />}
            />
            <Route
              path='product'
              element={<Product />}
            />
            <Route
              path='pricing'
              element={<Pricing />}
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='app'
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Navigate
                    replace
                    to='cities'
                  />
                }
              />
              <Route
                path='cities'
                element={<CityList />}
              />
              <Route
                path='cities/:id'
                element={<City />}
              />

              <Route
                path='countries'
                element={<CountryList />}
              />

              <Route
                path='form'
                element={<Form />}
              />
            </Route>

            <Route
              path='*'
              element={<PageNotFound />}
            />
          </Routes>
        </BrowserRouter>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
