import { Passion_One, Sriracha } from 'next/font/google';
import './globals.css';

// Mesmas fontes do projeto-cordel: Passion One (títulos) e Sriracha (texto
// manuscrito). O next/font baixa e hospeda as duas junto com o site.
const passionOne = Passion_One({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--next-passion',
});

const sriracha = Sriracha({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--next-sriracha',
});

export const metadata = {
  title: 'Mirian Vasconcelos - Estética e Beleza | Cílios, Sobrancelhas e Depilação',
  description:
    'Serviços especializados de estética por Mirian Vasconcelos, designer de cílios, sobrancelhas e depilação. Agende agora com Mirian Designer!',
  keywords: [
    'Mirian Vasconcelos',
    'Mirian Designer',
    'cílios',
    'sobrancelhas',
    'depilação',
    'estética',
    'beleza',
    'cuidados pessoais',
  ],
  authors: [{ name: 'Mirian Vasconcelos' }],
  icons: { icon: '/icone.nav.png' },
  openGraph: {
    title: 'Mirian Vasconcelos - Estética e Beleza | Cílios, Sobrancelhas e Depilação',
    description:
      'Serviços de estética e beleza por Mirian Designer. Confira nossos serviços de cílios, sobrancelhas e depilação.',
    url: 'https://miriandesignerepiladora.onrender.com/',
    images: ['https://i.postimg.cc/X7w6DV34/site-Mirian-1024.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mirian Vasconcelos - Estética e Beleza | Cílios, Sobrancelhas e Depilação',
    description:
      'Serviços especializados de estética por Mirian Vasconcelos. Agende agora seus cuidados com cílios, sobrancelhas e depilação.',
    images: ['https://i.postimg.cc/X7w6DV34/site-Mirian-1024.jpg'],
  },
  other: {
    'google-adsense-account': 'ca-pub-2594785427581912',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${passionOne.variable} ${sriracha.variable}`}>
      <body>{children}</body>
    </html>
  );
}
