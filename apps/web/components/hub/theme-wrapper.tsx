'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { createStyleRegistry, StyleRegistry } from 'styled-jsx';
import { WorkspaceConfigWithoutSecretProps } from '@/lib/types';

export default function CustomThemeWrapper({
  children,
  workspaceConfig,
}: {
  children: React.ReactNode;
  workspaceConfig: WorkspaceConfigWithoutSecretProps;
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
        {workspaceConfig.workspace_theme === 'custom' && (
          <style jsx global>{`
            .feedbase-hub {
              --root-background: ${workspaceConfig.custom_theme_root};

              --background: ${workspaceConfig.custom_theme_secondary_background};
              --foreground: ${workspaceConfig.custom_theme_primary_foreground};

              --popover: ${workspaceConfig.custom_theme_root};
              --card: ${workspaceConfig.custom_theme_root};

              --primary: ${workspaceConfig.custom_theme_background};
              --primary-foreground: ${workspaceConfig.custom_theme_root};

              --secondary: ${workspaceConfig.custom_theme_secondary_background};

              --accent: ${workspaceConfig.custom_theme_secondary_background} / 0.3;

              --muted: ${workspaceConfig.custom_theme_secondary_background} / 0.5;

              --highlight: ${workspaceConfig.custom_theme_accent};

              --ring: ${workspaceConfig.custom_theme_accent} / 0.3;
              --border: ${workspaceConfig.custom_theme_border};
              --input: ${workspaceConfig.custom_theme_border};
            }
          `}</style>
        )}
        {children}
      </main>
    </StyleRegistry>
  );
}
