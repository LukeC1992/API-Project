import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import SpotCard from './components/SpotCards'
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot'
import ManageSpots from './components/ManageSpots/ManageSpots';
import EditSpot from './components/EditSpot/EditSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    path: '/',
    children: [
      {
        index: true,
        element: <SpotCard current={false}/>,
      },
      {
        path: 'spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: 'spots/new',
        element: <CreateSpot edit={false}/>
      },{
        path: 'spots/current',
        element: <><ManageSpots /><SpotCard current={true}/></>,
      },
      {
        path: 'spots/:spotId/edit',
        element: <EditSpot edit={true} />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;