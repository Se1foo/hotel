import type { Deal } from '../models/deal.model';

const deals: Deal[] = [
  {
    id: 1,
    title: 'Viceroy Bali Luxury Resort',
    location: 'Ubud, Bali',
    originalPrice: 1800,
    price: 1250,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaLP227AGZW2E3Pp7jwBBCUbBcbliZyqs3LwwaqkBA1kf4aS2O5zg7-3TMrFEp6NZXYjh9mmDX7KDjKfc62rc-hPGUxwxnNHkFtAf9s1OMf_utZdsio_y9wpPBvM1diZZaZ6yfO3W09YQaRCt-3Nk5SCH4xk2SUxpy3UrysJt23eK6xYuwCfHz7UdoBixG7XEUaDJPMWBErMF78Ixb1X1XBy9pCydS6AcYfwd4T3ZoDyNvlzC_XASMHkp6gpAjpckWiAlAGjwjTXLs',
    tag: 'Top Pick',
    type: 'featured',
  },
  {
    id: 2,
    title: 'Aura Suites',
    location: 'Santorini, Greece',
    originalPrice: 1200,
    price: 780,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWkmvep8j9PtpsJ38xYfcvQ3ZVGWc9SgKQTVJRP8Su47falc6Hcu-ccqFB7LKxnCLIip6HE1qv73w5v2jQzNXxXGvtN-RA6iM_9YGa9z_3TCB7PWm6obiQqCtyDnqHcx-N6L6Q7nz5qtAOX_Wb1ykyUyihortQkI76VZA6ifm6Sf6hAzUYclWaDZG0D9op6xTLirT5DErSF2sWWDbtvGY2qvub5J3KIrgKd_k9yxjW4lEPPsmbZziS5lw341csXVxS0i5yxLjlsIcU',
    tag: 'Save 35%',
    type: 'small',
  },
  {
    id: 3,
    title: 'Coco Bodu Hithi',
    location: 'Maldives',
    originalPrice: 2100,
    price: 1450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWoaw2MxH4yyUrW4TMotsxLeDBxp21VJPXthmlubbwD-LJ3iKF8eG7nrae90uWD9vKMnWT3HnpHUCO4HRjxzbWlMHZGiOp2C1KTh7AvrmNK_2Z3M_KrkV4JCx6MTuAzyrnXsyosXdl5zS-TQyVix7LSuQ73EGA_hK0J1fR3b6Cpq7rlLgoTpWSKiZH28V7Qomt34hP5KFD4tIHhycuzjr9m_Ihp_vJqNMEt2vTHNMqFjfUn1kIpesPg6lolZxwX806YTebn5U47pTO',
    tag: 'Flash Deal',
    type: 'small',
  },
  {
    id: 4,
    title: 'The Chedi Andermatt',
    location: 'Swiss Alps, Switzerland',
    originalPrice: 1600,
    price: 1100,
    description: 'Experience unparalleled alpine luxury with exclusive access to premium ski slopes and world-class spa facilities. Includes daily breakfast and one massage.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPTO_482M6QwYIY9u_ji_KpjqMY2xYGwU5m---wEbUFK7E-GYOzk-pcIyuPFj2XJUaUGlvvUc3oqqixgckHzZVtL9aOD6PNH1G6H2f36XCmoW9VEibnI-ZlDo0P2z3synlyp-EEvOdHROMxiMZnMeVm344ZHa-E0FUFyvoqo5mZfjcOi9974wjskpVNAb64-BVZAJ5fiQEvLcLddRKiGOFH87CaxRunT3LYyU67qE7XQlgtDUxcDLFeGjCUphiP_2jLdeInK-CIr2G',
    tag: 'Winter Escape',
    type: 'medium',
  },
];

export function getDeals(): Deal[] {
  return deals;
}
