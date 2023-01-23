import { ChartMetaData } from './chart-meta-data';

export interface ChartData {
  symbolSize: number;
  name: string;
  value: string;
  label: {
    show: boolean,
    fontSize: number,
    fontWeight: number,
    color: string
  };
  itemStyle: {
    color: string;
  };
  metaData?: ChartMetaData
}