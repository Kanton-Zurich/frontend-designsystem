export type StatisticsDetailPage = {
  link: string;
  title: string;
  text?: string[];
  publicationType: string;
  teaserImage: string;
  tags?: string[];
};

export type StatisticSearchUrlQueryParams = {
  page: string;
  tag: string;
  wcmmode: string;
};
