import { ScatterDataPoint, TimeUnit } from 'chart.js';

export type Device = {
  id: string;
  name: string;
};

export type PieChartData = { deviceName: string; totalConsumption: number };
export interface AppConfig {
  inputStyle?: string;
  dark?: boolean;
  theme?: string;
  ripple?: boolean;
  scale?: number;
}

export type ToolbarOptions = {
  timeUnit: TimeUnitConfig;
  minDate: string;
  deviceId?: string;
  deviceName?: string;
  userId?: string;
};

export type TimeUnitConfig = { forApi: TimeUnit; forChart: TimeUnit };

export const DevicesColors = new Map<string, string>([
  ['ac', '#CDFCF6'],
  ['ac2', '#3b82f6'],
  ['computer', '#66bb6a'],
  ['din', '#002B5B'],
  ['dishwasher', '#98A8F8'],
  ['drier', '#295bac'],
  ['drier_and_washing_machine', '#c7d2fe'],
  ['tv', '#dee2e6'],
  ['washing_machine', '#4338ca']
]);

export type ChartData = {
  data: ScatterDataPoint[];
  minDate: string;
  maxDate: string;
  average?: ScatterDataPoint[];
};
