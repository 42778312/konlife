export type TaxiCompany = {
  id: string;
  name: string;
  digits: string;
};

export const TAXI_COMPANIES: TaxiCompany[] = [
  { id: 'mueller', name: 'Taxi Müller', digits: '0753165300' },
  { id: 'seetaxi', name: 'Taxi Seetaxi', digits: '0753151000' },
  { id: 'dornheim', name: 'Taxi Dornheim', digits: '0753167777' },
  { id: 'fraedrich', name: 'Taxi Frädrich', digits: '07533998227' },
  { id: 'taxmobil', name: 'Taxmobil', digits: '0753180210' },
  { id: 'fuxxx', name: 'City Fuxxx', digits: '075318029140' },
];

export const TARIFF_SOURCE = 'Landkreis Konstanz tariff · meter is final';

export function formatTaxiNumber(digits: string): string {
  if (digits.startsWith('07531')) return `07531 ${digits.slice(5)}`;
  if (digits.startsWith('07533')) return `07533 ${digits.slice(5)}`;
  return digits;
}

export function taxiCallUrl(digits: string): string {
  const national = digits.replace(/^0/, '');
  return `tel:+49${national}`;
}
