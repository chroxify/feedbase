export interface IconObject {
  dark: Record<string, unknown> | string;
  light: Record<string, unknown> | string;
}

function createIconObject(iconName: string): IconObject {
  return {
    dark: require(`@/components/shared/icons/${iconName}-dark.json`),
    light: require(`@/components/shared/icons/${iconName}-light.json`),
  };
}

export const FeedbackIcon = createIconObject('feedback');
export const CalendarIcon = createIconObject('calendar');
export const SettingsIcon = createIconObject('settings');
export const TagLabelIcon = createIconObject('tag-label');
export const CodeIcon = createIconObject('code');
export const LogoutIcon = createIconObject('logout');
export const ProfileIcon = createIconObject('profile');
export const SearchIcon = createIconObject('search');
export const ChatIcon = createIconObject('chat');
export const AnalyticsIcon = createIconObject('analytics');
