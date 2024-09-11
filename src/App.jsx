import { useState } from 'react';
import AppRoutes from './routes/Routes';

import Header from './layouts/Header/Header';
import Sidebar from './layouts/Sidebar/Sidebar';
import Footer from './layouts/Footer/Footer';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
			{isLoggedIn && <Header />}
      <div className="main-content">
        {isLoggedIn && <Sidebar />}
				<main>
          <AppRoutes setIsLoggedIn={setIsLoggedIn} /> 
        </main>
				</div>
      {isLoggedIn && <Footer />}
    </>
  );
}

export default App;