import { Suspense } from 'react';
import { AppRouter } from '@/app/router';
import { Providers } from '@/app/providers';

import { AppSkeleton } from '@/app/ui';

function App() {
  return (
    <Providers>
      <Suspense fallback={<AppSkeleton />}>
        <AppRouter />
      </Suspense>
    </Providers>
  );
}

export default App;
