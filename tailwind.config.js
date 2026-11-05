import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    primary: '#4A2C11',
                    'primary-hover': '#38210D',
                    secondary: '#C88242',
                    'secondary-hover': '#B37033',
                    tertiary: '#8C3D2B',
                    'tertiary-hover': '#733122',
                },
                surface: {
                    canvas: '#FAF7F2',
                    container: '#F5EFEB',
                    'container-high': '#EDE4DC',
                    border: '#EDE4DC',
                },
                content: {
                    high: '#241408',
                    medium: '#5C3A21',
                    subtle: '#9C8474',
                },
            },
        },
    },

    plugins: [forms],
};
