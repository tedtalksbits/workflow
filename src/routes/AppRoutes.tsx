import { Button } from '@/components/ui/button';
import { AppProvider } from '@/providers/app';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const AppRoutes = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              <div>
                <Button>Nice Button</Button>
              </div>
            }
          />
          <Route path='/about' element={<div>About</div>} />
        </Routes>
      </Router>
    </AppProvider>
  );
};
