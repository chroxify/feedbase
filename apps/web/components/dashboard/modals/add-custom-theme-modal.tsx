'use client';

import { useState } from 'react';
import { Badge } from '@ui/components/ui/badge';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import { cn } from '@ui/lib/utils';
import { ChevronUp } from 'lucide-react';
import { Button } from 'ui/components/ui/button';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';
import { ProjectConfigWithoutSecretProps } from '@/lib/types';
import { hexToHSL, hslToHex } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';

// Helper component
function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full rounded-md border text-sm font-extralight transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
      <div
        className={cn(
          'text-foreground/50 bg-accent flex select-none items-center justify-center rounded-l-md border-r',
          value === '' ? 'px-3' : 'px-2'
        )}>
        {value === '' ? '#' : <div className='h-3 w-3 rounded-sm' style={{ backgroundColor: value }} />}
      </div>
      <Input
        className='text-foreground/80 h-full w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
        placeholder='000000'
        value={value}
        onChange={(e) => {
          // Cap length at 7
          if (e.target.value.length > 7) return;

          onChange(e);
        }}
      />
    </div>
  );
}

export default function CustomizeThemeModal({
  children,
  projectConfig,
  setProjectConfig,
}: {
  children: React.ReactNode;
  projectConfig: ProjectConfigWithoutSecretProps;
  setProjectConfig: React.Dispatch<React.SetStateAction<ProjectConfigWithoutSecretProps>>;
}) {
  const [colorScheme, setColorScheme] = useState({
    root: hslToHex(projectConfig.custom_theme_root) || '',
    background: hslToHex(projectConfig.custom_theme_background) || '',
    secondary_background: hslToHex(projectConfig.custom_theme_secondary_background) || '',
    foreground: hslToHex(projectConfig.custom_theme_primary_foreground) || '',
    accent: hslToHex(projectConfig.custom_theme_accent) || '',
    border: hslToHex(projectConfig.custom_theme_border) || '',
  });

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-lg'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className='flex flex-row items-center gap-2'>
            Customize Theme{' '}
            <Badge
              variant='secondary'
              className='border-border text-foreground/70 rounded-md border font-light'>
              Experimental
            </Badge>
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Create your own color theme.</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='grid w-full grid-cols-2 gap-4'>
          {/* Root */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Background Color</Label>
            </div>

            <ColorInput
              value={colorScheme.root}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, root: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, root: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs font-extralight'>Root background of page</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Foreground Color</Label>
            </div>

            <ColorInput
              value={colorScheme.foreground}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, foreground: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, foreground: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs font-extralight'>Primary text color</Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Primary Color</Label>
            </div>

            <ColorInput
              value={colorScheme.background}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, background: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, background: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs font-extralight'>
              Primary background (buttons, etc.)
            </Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Secondary Color</Label>
            </div>

            <ColorInput
              value={colorScheme.secondary_background}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, secondary_background: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, secondary_background: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs font-extralight'>
              Secondary background (buttons, etc.)
            </Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Accent Color</Label>
            </div>

            <ColorInput
              value={colorScheme.accent}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, accent: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, accent: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs font-extralight'>
              Accent color (links, selection, etc.)
            </Label>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='bg'>Border Color</Label>
            </div>

            <ColorInput
              value={colorScheme.border}
              onChange={(e) => {
                // if first character is not #, add it
                if (!e.target.value.startsWith('#')) {
                  setColorScheme((prev) => ({ ...prev, border: `#${e.target.value}` }));
                  return;
                }

                setColorScheme((prev) => ({ ...prev, border: e.target.value }));
              }}
            />

            <Label className='text-foreground/50 text-xs font-extralight'>Border color for elements</Label>
          </div>
        </div>

        {/* Preview Example */}
        <div className='mt-4 flex flex-col gap-4'>
          <div className='flex flex-row items-center gap-2'>
            <Label>Preview</Label>
          </div>

          {/* Small wireframe replica of website with color scheme */}
          <div
            className='flex h-96 w-full flex-col gap-4 overflow-y-hidden rounded-md border'
            style={{ backgroundColor: colorScheme.root, textDecorationStyle: 'solid' }}>
            {/* Header */}
            <div
              className='flex flex-row items-center justify-between border-b p-4'
              style={{ borderColor: colorScheme.border }}>
              <Icons.LogoText className='fill-foreground h-6 w-20' style={{ fill: colorScheme.foreground }} />
              <div
                className='flex h-5 w-12 items-center justify-center rounded-md bg-white text-[10px]'
                style={{ backgroundColor: colorScheme.background, color: colorScheme.foreground }}>
                Login
              </div>
            </div>

            {/* Body */}
            <div className='flex flex-col gap-4 px-4'>
              <div className='w-full border-b px-2 pb-4' style={{ borderColor: colorScheme.border }}>
                <p className='text-sm font-extralight' style={{ color: colorScheme.foreground }}>
                  Feedback
                </p>
                <p
                  className='text-foreground text-xs font-extralight'
                  style={{ color: colorScheme.foreground, opacity: 0.5 }}>
                  Have a suggestion or found a bug? Let us know!
                </p>
              </div>

              <div className='flex w-full justify-between gap-1'>
                <div className='flex gap-1'>
                  <div
                    className='flex h-5 w-10 items-center justify-center rounded-md border bg-white text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background,
                      borderColor: colorScheme.border,
                      color: colorScheme.foreground,
                    }}>
                    New
                  </div>
                  <div
                    className='flex h-5 w-10 items-center justify-center rounded-md border bg-white text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background,
                      borderColor: colorScheme.border,
                      color: colorScheme.foreground,
                    }}>
                    Top
                  </div>
                </div>

                <div className='flex gap-1'>
                  <div
                    className='flex h-5 w-20 items-center justify-start rounded-md border bg-white pl-1.5 text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background,
                      borderColor: colorScheme.border,
                      color: colorScheme.foreground,
                    }}>
                    Search
                  </div>
                  <div
                    className='flex h-5 w-10 items-center justify-center rounded-md border bg-white text-[10px]'
                    style={{
                      backgroundColor: colorScheme.secondary_background,
                      borderColor: colorScheme.border,
                      color: colorScheme.foreground,
                    }}>
                    Post
                  </div>
                </div>
              </div>

              {[...Array(4)].map((_, i) => (
                <div
                  className='flex w-full rounded-md border'
                  key={i}
                  style={{ borderColor: colorScheme.border }}>
                  <div
                    className='flex h-full w-6 items-center justify-center border-r'
                    style={{ borderColor: colorScheme.border }}>
                    <ChevronUp
                      className='text-foreground/50 h-4 w-4'
                      style={{ color: colorScheme.foreground }}
                    />
                  </div>

                  <div className='flex flex-col p-1'>
                    <p
                      className='text-foreground/80 text-[11px] font-extralight'
                      style={{ color: colorScheme.foreground }}>
                      Demo Feedback Idea
                    </p>
                    <p
                      className='text-foreground text-[10px] font-extralight'
                      style={{ color: colorScheme.foreground, opacity: 0.6 }}>
                      This is a demo feedback message to test theming.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </ResponsiveDialogClose>
          <ResponsiveDialogClose asChild>
            <Button
              type='submit'
              disabled={Object.values(colorScheme).some((prop) => prop.length < 4)}
              onClick={() => {
                // Update project config
                setProjectConfig((prev) => ({
                  ...prev,
                  custom_theme: 'custom',
                  custom_theme_root: hexToHSL(colorScheme.root) || '',
                  custom_theme_background: hexToHSL(colorScheme.background) || '',
                  custom_theme_secondary_background: hexToHSL(colorScheme.secondary_background) || '',
                  custom_theme_primary_foreground: hexToHSL(colorScheme.foreground) || '',
                  custom_theme_accent: hexToHSL(colorScheme.accent) || '',
                  custom_theme_border: hexToHSL(colorScheme.border) || '',
                }));
              }}>
              Set theme
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
