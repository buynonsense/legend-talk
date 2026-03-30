import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { SharedView } from './pages/SharedView';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/chat" replace /> },
      { path: 'chat/:id?', element: <ChatPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'shared/:data', element: <SharedView /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
