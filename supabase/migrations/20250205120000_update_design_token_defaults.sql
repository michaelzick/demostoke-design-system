-- Align design_system_settings defaults with Tokens.tsx canonical values
ALTER TABLE public.design_system_settings
  ALTER COLUMN primary_color SET DEFAULT '#00dcf5',
  ALTER COLUMN primary_color_dark SET DEFAULT '#0da2e7',
  ALTER COLUMN secondary_color SET DEFAULT '#f3dfb9',
  ALTER COLUMN secondary_color_dark SET DEFAULT '#d4c7af',
  ALTER COLUMN accent_color SET DEFAULT '#f1f5f9',
  ALTER COLUMN accent_color_dark SET DEFAULT '#1e293b',
  ALTER COLUMN success_color SET DEFAULT '#22c35d',
  ALTER COLUMN success_color_dark SET DEFAULT '#26d968',
  ALTER COLUMN destructive_color_dark SET DEFAULT '#7f1d1d',
  ALTER COLUMN warning_color SET DEFAULT '#f9a91f',
  ALTER COLUMN warning_color_dark SET DEFAULT '#f5b13d',
  ALTER COLUMN background_color_dark SET DEFAULT '#020817',
  ALTER COLUMN foreground_color SET DEFAULT '#020817',
  ALTER COLUMN border_color_dark SET DEFAULT '#1e293b',
  ALTER COLUMN ring_color SET DEFAULT '#0da2e7',
  ALTER COLUMN ring_color_dark SET DEFAULT '#1d4ed8',
  ALTER COLUMN sidebar_background SET DEFAULT '#fafafa',
  ALTER COLUMN sidebar_background_dark SET DEFAULT '#18181b',
  ALTER COLUMN sidebar_foreground SET DEFAULT '#3f3f46',
  ALTER COLUMN sidebar_foreground_dark SET DEFAULT '#f4f4f5',
  ALTER COLUMN sidebar_primary SET DEFAULT '#18181b',
  ALTER COLUMN sidebar_primary_dark SET DEFAULT '#1d4ed8',
  ALTER COLUMN sidebar_primary_foreground SET DEFAULT '#fafafa',
  ALTER COLUMN sidebar_primary_foreground_dark SET DEFAULT '#f8fafc',
  ALTER COLUMN sidebar_accent SET DEFAULT '#f4f4f5',
  ALTER COLUMN sidebar_accent_dark SET DEFAULT '#27272a',
  ALTER COLUMN sidebar_accent_foreground SET DEFAULT '#18181b',
  ALTER COLUMN sidebar_accent_foreground_dark SET DEFAULT '#f4f4f5',
  ALTER COLUMN sidebar_border SET DEFAULT '#e5e7eb',
  ALTER COLUMN sidebar_border_dark SET DEFAULT '#27272a',
  ALTER COLUMN spacing_xs SET DEFAULT '4px',
  ALTER COLUMN spacing_sm SET DEFAULT '8px',
  ALTER COLUMN spacing_md SET DEFAULT '16px',
  ALTER COLUMN spacing_lg SET DEFAULT '24px',
  ALTER COLUMN spacing_xl SET DEFAULT '32px',
  ALTER COLUMN spacing_2xl SET DEFAULT '48px',
  ALTER COLUMN spacing_3xl SET DEFAULT '64px',
  ALTER COLUMN spacing_4xl SET DEFAULT '96px',
  ALTER COLUMN font_display_lg SET DEFAULT '3.5rem',
  ALTER COLUMN font_display_md SET DEFAULT '2.75rem';

-- Refresh existing rows that still carry legacy defaults
UPDATE public.design_system_settings
SET
  primary_color = '#00dcf5'
WHERE primary_color IS NULL OR primary_color IN ('#3b82f6');

UPDATE public.design_system_settings
SET
  primary_color_dark = '#0da2e7'
WHERE primary_color_dark IS NULL OR primary_color_dark IN ('#60a5fa');

UPDATE public.design_system_settings
SET
  secondary_color = '#f3dfb9'
WHERE secondary_color IS NULL OR secondary_color IN ('#6b7280');

UPDATE public.design_system_settings
SET
  secondary_color_dark = '#d4c7af'
WHERE secondary_color_dark IS NULL OR secondary_color_dark IN ('#9ca3af');

UPDATE public.design_system_settings
SET
  accent_color = '#f1f5f9'
WHERE accent_color IS NULL OR accent_color IN ('#f59e0b');

UPDATE public.design_system_settings
SET
  accent_color_dark = '#1e293b'
WHERE accent_color_dark IS NULL OR accent_color_dark IN ('#fbbf24');

UPDATE public.design_system_settings
SET
  success_color = '#22c35d'
WHERE success_color IS NULL OR success_color IN ('#10b981');

UPDATE public.design_system_settings
SET
  success_color_dark = '#26d968'
WHERE success_color_dark IS NULL OR success_color_dark IN ('#34d399');

UPDATE public.design_system_settings
SET
  destructive_color_dark = '#7f1d1d'
WHERE destructive_color_dark IS NULL OR destructive_color_dark IN ('#f87171');

UPDATE public.design_system_settings
SET
  warning_color = '#f9a91f'
WHERE warning_color IS NULL OR warning_color IN ('#f59e0b');

UPDATE public.design_system_settings
SET
  warning_color_dark = '#f5b13d'
WHERE warning_color_dark IS NULL OR warning_color_dark IN ('#fbbf24');

UPDATE public.design_system_settings
SET
  background_color_dark = '#020817'
WHERE background_color_dark IS NULL OR background_color_dark IN ('#0f172a');

UPDATE public.design_system_settings
SET
  foreground_color = '#020817'
WHERE foreground_color IS NULL OR foreground_color IN ('#0f172a');

UPDATE public.design_system_settings
SET
  border_color_dark = '#1e293b'
WHERE border_color_dark IS NULL OR border_color_dark IN ('#334155');

UPDATE public.design_system_settings
SET
  ring_color = '#0da2e7'
WHERE ring_color IS NULL OR ring_color IN ('#3b82f6');

UPDATE public.design_system_settings
SET
  ring_color_dark = '#1d4ed8'
WHERE ring_color_dark IS NULL OR ring_color_dark IN ('#60a5fa');

UPDATE public.design_system_settings
SET
  sidebar_background = '#fafafa'
WHERE sidebar_background IS NULL OR sidebar_background IN ('#f8fafc');

UPDATE public.design_system_settings
SET
  sidebar_background_dark = '#18181b'
WHERE sidebar_background_dark IS NULL OR sidebar_background_dark IN ('#020817');

UPDATE public.design_system_settings
SET
  sidebar_foreground = '#3f3f46'
WHERE sidebar_foreground IS NULL OR sidebar_foreground IN ('#0f172a');

UPDATE public.design_system_settings
SET
  sidebar_foreground_dark = '#f4f4f5'
WHERE sidebar_foreground_dark IS NULL OR sidebar_foreground_dark IN ('#f8fafc');

UPDATE public.design_system_settings
SET
  sidebar_primary = '#18181b'
WHERE sidebar_primary IS NULL OR sidebar_primary IN ('#3b82f6');

UPDATE public.design_system_settings
SET
  sidebar_primary_dark = '#1d4ed8'
WHERE sidebar_primary_dark IS NULL OR sidebar_primary_dark IN ('#60a5fa');

UPDATE public.design_system_settings
SET
  sidebar_primary_foreground = '#fafafa'
WHERE sidebar_primary_foreground IS NULL OR sidebar_primary_foreground IN ('#ffffff');

UPDATE public.design_system_settings
SET
  sidebar_primary_foreground_dark = '#f8fafc'
WHERE sidebar_primary_foreground_dark IS NULL OR sidebar_primary_foreground_dark IN ('#0f172a');

UPDATE public.design_system_settings
SET
  sidebar_accent = '#f4f4f5'
WHERE sidebar_accent IS NULL OR sidebar_accent IN ('#f1f5f9');

UPDATE public.design_system_settings
SET
  sidebar_accent_dark = '#27272a'
WHERE sidebar_accent_dark IS NULL OR sidebar_accent_dark IN ('#1e293b');

UPDATE public.design_system_settings
SET
  sidebar_accent_foreground = '#18181b'
WHERE sidebar_accent_foreground IS NULL OR sidebar_accent_foreground IN ('#0f172a');

UPDATE public.design_system_settings
SET
  sidebar_accent_foreground_dark = '#f4f4f5'
WHERE sidebar_accent_foreground_dark IS NULL OR sidebar_accent_foreground_dark IN ('#f8fafc');

UPDATE public.design_system_settings
SET
  sidebar_border = '#e5e7eb'
WHERE sidebar_border IS NULL OR sidebar_border IN ('#e2e8f0');

UPDATE public.design_system_settings
SET
  sidebar_border_dark = '#27272a'
WHERE sidebar_border_dark IS NULL OR sidebar_border_dark IN ('#334155');

UPDATE public.design_system_settings
SET
  spacing_xs = '4px'
WHERE spacing_xs IS NULL OR spacing_xs IN ('0.5rem');

UPDATE public.design_system_settings
SET
  spacing_sm = '8px'
WHERE spacing_sm IS NULL OR spacing_sm IN ('0.75rem');

UPDATE public.design_system_settings
SET
  spacing_md = '16px'
WHERE spacing_md IS NULL OR spacing_md IN ('1rem');

UPDATE public.design_system_settings
SET
  spacing_lg = '24px'
WHERE spacing_lg IS NULL OR spacing_lg IN ('1.5rem');

UPDATE public.design_system_settings
SET
  spacing_xl = '32px'
WHERE spacing_xl IS NULL OR spacing_xl IN ('2rem');

UPDATE public.design_system_settings
SET
  spacing_2xl = '48px'
WHERE spacing_2xl IS NULL OR spacing_2xl IN ('3rem');

UPDATE public.design_system_settings
SET
  spacing_3xl = '64px'
WHERE spacing_3xl IS NULL OR spacing_3xl IN ('4rem');

UPDATE public.design_system_settings
SET
  spacing_4xl = '96px'
WHERE spacing_4xl IS NULL OR spacing_4xl IN ('6rem');

UPDATE public.design_system_settings
SET
  font_display_lg = '3.5rem'
WHERE font_display_lg IS NULL OR font_display_lg IN ('4rem');

UPDATE public.design_system_settings
SET
  font_display_md = '2.75rem'
WHERE font_display_md IS NULL OR font_display_md IN ('3rem');
