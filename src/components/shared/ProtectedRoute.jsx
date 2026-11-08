import { Navigate, useLocation } from 'react-router-dom'

// Route guard for authenticated paths
export default function ProtectedRoute({ currentUser, children }) {
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return children
}

