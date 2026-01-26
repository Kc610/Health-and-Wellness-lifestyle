import { Product } from '../types';
import { parseProductsFromCsv, rawCsvData } from '../utils/csvParser';

export const PRODUCTS: Product[] = parseProductsFromCsv(rawCsvData);
