export type ThemeToggleProps = {
  controlled?: boolean;
};

export type ThemeToggleButtonProps = {
  isDark: boolean;
  onChange: () => void;
  invertedIconLogic?: boolean;
};
