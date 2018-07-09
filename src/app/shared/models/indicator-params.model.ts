export class IndicatorParams {
  years?: string;
  units?: string;
  time_aggregation?: string;
  models?: string;
  variables?: string;
  agg?: string;

  // Threshold indicators specific
  threshold?: number;
  threshold_units?: string;
  threshold_comparator?: 'gt'|'gte'|'eq'|'lt'|'lte';

  // Degree day indicators specific
  basetemp?: number;
  basetemp_units?: string;

  // Percentile indicators specific
  percentile?: number;
}
