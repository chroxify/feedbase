'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { createStyleRegistry, StyleRegistry } from 'styled-jsx';
import { ProjectConfigWithoutSecretProps } from '@/lib/types';

export default function CustomThemeWrapper({
  children,
  projectConfig,
}: {
  children: React.ReactNode;
  projectConfig: ProjectConfigWithoutSecretProps;
}) {
  // eslint-disable-next-line react/hook-use-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <div className='h-full w-full'>{styles}</div>;
  });

  return (
    <StyleRegistry registry={jsxStyleRegistry}>
      <main className='feedbase-hub bg-root flex min-h-screen min-w-full flex-col justify-between'>
        {projectConfig.custom_theme === 'custom' && (
          <style jsx global>{`
            .feedbase-hub {
              --root-background: ${projectConfig.custom_theme_root};

              --background: ${projectConfig.custom_theme_secondary_background};
              --foreground: ${projectConfig.custom_theme_primary_foreground};

              --popover: ${projectConfig.custom_theme_root};
              --card: ${projectConfig.custom_theme_root};

              --primary: ${projectConfig.custom_theme_background};
              --primary-foreground: ${projectConfig.custom_theme_root};

              --secondary: ${projectConfig.custom_theme_secondary_background};

              --accent: ${projectConfig.custom_theme_secondary_background} / 0.3;

              --muted: ${projectConfig.custom_theme_secondary_background} / 0.5;

              --highlight: ${projectConfig.custom_theme_accent};

              --ring: ${projectConfig.custom_theme_accent} / 0.3;
              --border: ${projectConfig.custom_theme_border};
              --input: ${projectConfig.custom_theme_border};
            }
          `}</style>
        )}
        {children}
      </main>
    </StyleRegistry>
  );
}
