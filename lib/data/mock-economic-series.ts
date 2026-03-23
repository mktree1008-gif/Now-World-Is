import type {CountryEconomicSeries} from '@/lib/types';

const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

function points(values: number[]): Array<{year: number; value: number}> {
  return years.map((year, idx) => ({year, value: values[idx]}));
}

export const mockEconomicSeries: CountryEconomicSeries[] = [
  {
    iso2: 'US',
    iso3: 'USA',
    countryName: 'United States',
    gdpPerCapita: points([57904, 59928, 62823, 65279, 63544, 70381, 76399, 80234, 81695]),
    pppGdpPerCapita: points([61290, 63214, 66211, 68720, 67510, 74188, 81105, 87212, 89021]),
    averageIq: 98,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'KR',
    iso3: 'KOR',
    countryName: 'South Korea',
    gdpPerCapita: points([29291, 31616, 33456, 31902, 31630, 34980, 32265, 34789, 35958]),
    pppGdpPerCapita: points([42012, 44806, 47342, 48311, 48954, 53402, 56117, 60310, 62211]),
    averageIq: 106,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'JP',
    iso3: 'JPN',
    countryName: 'Japan',
    gdpPerCapita: points([38931, 38634, 39860, 40112, 39847, 39312, 33815, 33573, 34287]),
    pppGdpPerCapita: points([42311, 44123, 45780, 46844, 45521, 48910, 51974, 54002, 54690]),
    averageIq: 106,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'DE',
    iso3: 'DEU',
    countryName: 'Germany',
    gdpPerCapita: points([42161, 44553, 47811, 46812, 45720, 52110, 48764, 54583, 56174]),
    pppGdpPerCapita: points([53327, 56098, 59077, 60210, 59344, 64322, 65210, 67542, 68914]),
    averageIq: 101,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'FR',
    iso3: 'FRA',
    countryName: 'France',
    gdpPerCapita: points([36874, 38720, 41630, 40888, 39112, 43654, 41408, 45975, 47451]),
    pppGdpPerCapita: points([46509, 48990, 51564, 52370, 51142, 55322, 57110, 59682, 60744]),
    averageIq: 98,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'GB',
    iso3: 'GBR',
    countryName: 'United Kingdom',
    gdpPerCapita: points([41049, 40692, 43310, 42789, 40345, 47099, 46001, 49302, 51076]),
    pppGdpPerCapita: points([47098, 49312, 52411, 53782, 52306, 57118, 59811, 62433, 63802]),
    averageIq: 99,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'CN',
    iso3: 'CHN',
    countryName: 'China',
    gdpPerCapita: points([8117, 8817, 9976, 10262, 10409, 12617, 12720, 13301, 13732]),
    pppGdpPerCapita: points([15312, 16789, 18333, 19820, 21210, 23287, 25144, 27312, 28743]),
    averageIq: 104,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'IN',
    iso3: 'IND',
    countryName: 'India',
    gdpPerCapita: points([1734, 1981, 2015, 2104, 1900, 2239, 2389, 2721, 2923]),
    pppGdpPerCapita: points([6220, 6859, 7212, 7674, 7101, 8178, 8990, 9805, 10466]),
    averageIq: 77,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'BR',
    iso3: 'BRA',
    countryName: 'Brazil',
    gdpPerCapita: points([8710, 9929, 9161, 8906, 6813, 7786, 8917, 10617, 11347]),
    pppGdpPerCapita: points([14811, 16003, 16523, 17019, 15440, 16990, 18210, 19780, 20603]),
    averageIq: 83,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'ZA',
    iso3: 'ZAF',
    countryName: 'South Africa',
    gdpPerCapita: points([5777, 6498, 7002, 6693, 5690, 7056, 6760, 6412, 6612]),
    pppGdpPerCapita: points([12221, 13109, 14093, 14380, 13619, 14970, 15430, 15721, 15980]),
    averageIq: 77,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'AE',
    iso3: 'ARE',
    countryName: 'United Arab Emirates',
    gdpPerCapita: points([37541, 40672, 43011, 43103, 36051, 43174, 47512, 49442, 50142]),
    pppGdpPerCapita: points([68432, 72610, 75423, 78220, 73981, 81244, 84681, 87212, 88145]),
    averageIq: 84,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  },
  {
    iso2: 'ID',
    iso3: 'IDN',
    countryName: 'Indonesia',
    gdpPerCapita: points([3567, 3838, 3894, 4135, 3870, 4349, 4788, 5232, 5458]),
    pppGdpPerCapita: points([10764, 11522, 12310, 13204, 12480, 13922, 14840, 15622, 16142]),
    averageIq: 79,
    averageIqYear: 2019,
    averageIqSource: 'Curated estimate'
  }
];
