import { ReactNode, useEffect, useState } from 'react';
import { App as AntdApp, theme as antdTheme, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { useTheme } from '@/shared/lib/theme';

interface AntdConfigProviderProps {
  children: ReactNode;
}

function AntdConfigProvider({ children }: AntdConfigProviderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  const isDark = resolvedTheme === 'dark';
  const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm,
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}

export default AntdConfigProvider;
