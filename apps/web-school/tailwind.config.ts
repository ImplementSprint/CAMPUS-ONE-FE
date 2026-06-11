import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './src/professor/**/*.{js,ts,jsx,tsx,mdx}',
    './src/alumni/**/*.{js,ts,jsx,tsx,mdx}',
    './src/applicant/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F59E0B',
        dark: '#0B0F14',
        campus: {
          ink: '#171717',
          surface: '#ffffff',
          page: '#f6f5f1',
          border: '#dedbd2',
          muted: '#6b675f',
          brand: '#d6a128',
          brandStrong: '#b98216',
        },
      },
    },
  },
  plugins: [],
};

export default config;
