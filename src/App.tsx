import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { MainScreen } from './components/MainScreen';

function App() {
  const [telegramUserId, setTelegramUserId] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    const user = WebApp.initDataUnsafe?.user;
    if (user?.id) {
      setTelegramUserId(user.id.toString());
      setIsReady(true);
    } else {
      setTelegramUserId('demo_user_' + Date.now());
      setIsReady(true);
    }

    if (WebApp.themeParams.bg_color) {
      document.body.style.backgroundColor = WebApp.themeParams.bg_color;
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <MainScreen telegramUserId={telegramUserId} />;
}

export default App;
