import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import Header from './components/Header'
import Body from './components/Body'
import Room from './components/Rooms'

export default function useRouteElement() {
  const useRouteElement = useRoutes([
    {
      path: path.home,
      element: (
        <div>
          <Header />
          <Body />
        </div>
      )
    },
    {
      path: path.room,
      element: (
        <div>
          <Room />
        </div>
      )
    }
  ])
  return useRouteElement
}
