const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const getEpgDataFromNbtc = async () => {
  return [];
  console.log(`Fetching epg data from NBTC...`);

  // mapping tvg id
  let channelNoToChannelKey = {
    '02': 'nbt',
    '03': 'thaipbs',
    '04': 'altv',
    '05': 'tv5',
    '07': 'tsports',
    10: 'tptv',
    16: 'tnn16',
    18: 'jkn18',
    22: 'nation',
    23: 'workpoint',
    24: 'true4u',
    25: 'gmm25',
    27: 'ch8',
    29: 'mono29',
    30: 'mcot',
    31: 'one',
    32: 'thairath',
    33: 'ch3',
    34: 'amarin',
    35: 'ch7',
    36: 'pptv',
  };

  // send request
  let rawData = {};
  try {
    const epgUrl = 'https://dttguide.nbtc.go.th/BcsEpgDataServices/BcsEpgDataController/getProgramDataWeb';
    const response = await axios.post(epgUrl, {
      channelType: '1',
    });
    rawData = response.data;
  } catch (error) {
    console.log(error);
    return [];
  }

  // get program start now + 2 days
  let currentDatetime = new Date();
  let currentDatetimePlus48Hrs = new Date(currentDatetime.getTime() + 48 * 3600 * 1000);

  // process data
  let epgData = [];
  for (let program of rawData.results) {
    if (!(program.channelNo in channelNoToChannelKey)) {
      continue;
    }

    let channelKey = channelNoToChannelKey[program.channelNo];

    const [day, month, year] = program.pgDate.split('-');
    let programStart = new Date(`20${year}-${month}-${day}T${program.pgBeginTime}+07:00`);
    let programEnd = new Date(`20${year}-${month}-${day}T${program.pgEndTime}+07:00`);
    if (programEnd < currentDatetime || programStart > currentDatetimePlus48Hrs) {
      continue;
    }
    let programStartStr = `20${year}${month}${day}${program.pgBeginTime.replace(/:/g, '')} +0700`;
    let programEndStr = `20${year}${month}${day}${program.pgEndTime.replace(/:/g, '')} +0700`;
    let programTitle = program.pgTitle ? program.pgTitle.trim() : 'No Program Name';
    let programDescription = undefined;
    if (
      program.pgDesc &&
      program.pgDesc.trim() &&
      program.pgDesc.trim() !== programTitle &&
      !['05', '29'].includes(program.channelNo) // tv5 and mono29 have useless programDescription
    ) {
      programDescription = program.pgDesc.trim();
    }
    epgData.push({
      programStartStr,
      programEndStr,
      channelKey,
      programTitle,
      programDescription,
    });
  }

  // console.log(`  / Fetched epg data from NBTC...`);
  return epgData;
};

const getEpgDataFromAisPlay = async () => {
  console.log('Fetching epg data from AIS PLAY...');

  // mapping tvg id
  let channelIdToChannelKey = {
    '5f9e908c12008d9caab3cf3b': 'nbt',
    '6378ef895b10cf050fd01614': 'thaipbs',
    '5efdd162fbb0045345ef2b61': 'altv',
    '5b335ab3d817de6d62889a6b': 'tv5',
    '627a27b26dbfe345cfc8a27f': 'tsports',
    '597be02d7ed5a24e46f67254': 'tptv',
    '59671d1cd817de1df19711a6': 'tnn16',
    '637b3a816d6b13ecd5676af4': 'jkn18',
    '6378f08337d179394ce585f4': 'nation',
    '632f2696fd54ec81809f7920': 'workpoint',
    '5b3359d9bf6aee16d7459c25': 'true4u',
    '5a702c48d817de6932b0db7a': 'gmm25',
    '5a127510d817de0fae3b6f2c': 'ch8',
    '60811938fa3813c616f38b63': 'mono29',
    '5efec3f10f6d9dc4b26c6e77': 'mcot',
    '5a1685baaae731375f0eb728': 'one',
    '60bd9c7b497960d3f9a3e222': 'thairath',
    '59592e08bf6aee4e3ecce051': 'ch3',
    '5b335b61bf6aee16d8c33382': 'amarin',
    '5abdd28daae73161cb8ef446': 'ch7',
    '5d4bebb6aae7315312049035': 'pptv',
    // '5fdb33c120ccacf849c813ef': 'voice',
    // '5ee1eb4d0f24872fd951d196': 'paramount',
    // '597e004b7ed5a24e46f6725a': 'warnertv',
    // '5e44faeeaae73158d325f8f9': 'hitsmovies',
    // '59ab204faae7311c5f0cc5ea': 'blueantent',
    // '63ca444c1eb6dd945e497d3f': 'mono29plus',
    // '605dad7dcebeb6db82829183': 'topnews',
    '5e69984f609ced33cfa4e734': 'bein1',
    '61c5829074626a5b6513d909': 'bein2',
    '5e699a69bf6aee30a499dc9b': 'bein3',
    // '5a52f069aae731507f5387bb': 'cartoonnetwork',
    // '5d424cdbaae73145f7f2b675': 'toonee',
    // '5ee1ecafb544d498b9d1d2e8': 'nickelodeon',
    // '597d21477ed5a24e46f67258': 'cartoonclub',
    // '5e6215e6d817de33506cedf7': 'discoveryasia',
    '597dfea47ed5a24e46f67259': 'boomerang',
    // '5967375cbf6aee05dcdfc126': 'tvb',
    // '597fff9d7ed5a20c8ae865d9': 'mangkorn',
    // '6501774d8ffee1f226fe8300': 'samrujlok',
  };

  // build parameter
  let currentDatetime = new Date();
  let currentDatetimePlus7Hrs = new Date(currentDatetime.getTime() + 7 * 3600 * 1000);
  let currentDatetimePlus55Hrs = new Date(currentDatetime.getTime() + 55 * 3600 * 1000);
  let startBkkDateStr = currentDatetimePlus7Hrs.toISOString().slice(0, 10);
  let startBkkTimeStr = currentDatetimePlus7Hrs.toISOString().slice(11, 16) + ':00';
  let endBkkDateStr = currentDatetimePlus55Hrs.toISOString().slice(0, 10);
  let endBkkTimeStr = currentDatetimePlus55Hrs.toISOString().slice(11, 16) + ':00';

  // send request
  let rawData = {};
  try {
    let epgUrl = `https://aisplay.ais.co.th/epg/?start_date=${startBkkDateStr}&end_date=${endBkkDateStr}&start_time=${startBkkTimeStr}&end_time=${endBkkTimeStr}&items=`;
    epgUrl += Object.keys(channelIdToChannelKey).join();
    const response = await axios.get(epgUrl, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // ignore Unable to verify the first certificate error
      }),
    });
    rawData = response.data;
  } catch (error) {
    console.log(error);
  }

  // process data
  let epgData = [];

  if (rawData.items === undefined) {
    return [];
  }

  for (let item of rawData.items) {
    let channelKey = channelIdToChannelKey[item.parent];
    let programStartStr = `${item.date}${item.start}`.replace(/-|:|T/g, '') + ' +0700';
    let programEndStr = `${item.date_end}${item.end}`.replace(/-|:|T/g, '') + ' +0700';
    let programTitle = item.title ? item.title.trim() : 'No Program Name';
    let programDescription = undefined;
    if (item.synopsis && item.synopsis.trim() && item.synopsis !== item.title) {
      programDescription = item.synopsis.trim();
    }
    epgData.push({
      programStartStr,
      programEndStr,
      channelKey,
      programTitle,
      programDescription,
    });
  }

  // console.log(`  / Fetched epg data from AIS Play...`);
  return epgData;
};

const getEpgDataFromTrueId = async () => {
  console.log('Fetching epg data from trueID...');

  const channelSlugToChannelKey = {
    truepremierfootballhd1: 'premier1',
    truepremierfootballhd2: 'premier2',
    truepremierfootballhd3: 'premier3',
    truepremierfootballhd4: 'premier4',
    truepremierfootballhd5: 'premier5',
    'truesport-hd': 'truesportshd1',
    'truesport-hd-2': 'truesportshd2',
  };

  // send request
  const allPageProps = await Promise.all(
    Object.keys(channelSlugToChannelKey).map(async (channelSlug) => {
      try {
        const epgUrl = `https://tv.trueid.net/th-th/live/${channelSlug}`;
        const response = await axios.get(epgUrl);
        if (response.status === 200) {
          const $ = cheerio.load(response.data);
          const nextData = $('#__NEXT_DATA__').html();
          const data = JSON.parse(nextData);
          if (!data || !data.props || !data.props.pageProps) {
            return null;
          }
          return data.props.pageProps;
        }
        return null;
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(
            `trueid_epg response error on ${channelSlug} => ${error.response.status}: ${error.response.data}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      }
    })
  );

  // process data
  const epgData = [];

  for (const pageProps of allPageProps) {
    if (pageProps === null) continue;

    const channelKey = channelSlugToChannelKey[pageProps.channelSlug];
    for (const program of pageProps.epgList) {
      if (program.status === false) {
        continue;
      }
      const programStartStr = `${program.start_date.slice(0, 19).replace(/-|:|T/g, '')} +0000`;
      const programEndStr = `${program.end_date.slice(0, 19).replace(/-|:|T/g, '')} +0000`;
      const programTitle = program.title ? program.title.trim() : 'No Program Name';
      const programDescription = program.ep_name || program.info.synopsis_th;
      epgData.push({
        programStartStr,
        programEndStr,
        channelKey,
        programTitle,
        programDescription,
      });
    }
  }

  return epgData;
};

const getEpgData = async () => {
  // EPG
  let epgDataFromNbtcPromise = getEpgDataFromNbtc();
  let epgDataFromAisPlayPromise = getEpgDataFromAisPlay();
  let epgDataFromTrueIdPromise = getEpgDataFromTrueId();

  const [epgDataFromNbtc, epgDataFromAisPlay, epgDataFromTrueId] = await Promise.all([
    epgDataFromNbtcPromise,
    epgDataFromAisPlayPromise,
    epgDataFromTrueIdPromise,
  ]);

  let mergedEpgData = [...epgDataFromNbtc, ...epgDataFromAisPlay, ...epgDataFromTrueId];
  mergedEpgData = mergedEpgData.sort((item1, item2) =>
    item1.channelKey > item2.channelKey
      ? 1
      : item1.channelKey < item2.channelKey
      ? -1
      : 0 || item1.programStartStr > item2.programStartStr
      ? 1
      : item1.programStartStr < item2.programStartStr
      ? -1
      : 0
  );

  return mergedEpgData;
};

module.exports = getEpgData;
