export type IconSrc = 'fa';

type Icons = 'edit-row' | 'submit-row' | 'delete-row';
export type IconMap = Record<IconSrc, Partial<Record<Icons, string>>>;
