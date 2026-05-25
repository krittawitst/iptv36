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

const getEpgDataFrom3bb = async () => {
  console.log('Fetching epg data from 3BB...');

  // mapping tvg id
  let channelIdToChannelKey = {
    2: 'nbt',
    3: 'thaipbs',
    5: 'tv5',
    7: 'tsports',
    10: 'tptv',
    16: 'tnn16',
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

  const allData = await Promise.all(
    Object.keys(channelIdToChannelKey).map(async (channelId) => {
      let epgUrl = `https://gigatv.3bbtv.co.th/wp-content/themes/changwattana/epg/${channelId}.json`;
      // console.log(epgUrl);

      try {
        const response = await axios.get(epgUrl);
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.log(`response from ${epgUrl} is undefined or not an array`);
          return [];
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    }),
  );

  // process data
  let epgData = [];
  let currentDatetime = new Date();
  let currentDatetimePlus72Hrs = new Date(currentDatetime.getTime() + 72 * 3600 * 1000);

  for (const dataOfThisChannel of allData) {
    for (const item of dataOfThisChannel) {
      // get program start now + 2 days
      try {
        let programStart = new Date(`${item.startTime.replace(/ /g, 'T')}+07:00`);
        let programEnd = new Date(`${item.endTime.replace(/ /g, 'T')}+07:00`);
        if (programEnd < currentDatetime || programStart > currentDatetimePlus72Hrs) {
          continue;
        }
      } catch (error) {
        console.log(error);
        continue;
      }

      let channelKey = channelIdToChannelKey[item.channelID];
      let programStartStr = item.startTime.replace(/-|:| /g, '') + ' +0700';
      let programEndStr = item.endTime.replace(/-|:| /g, '') + ' +0700';
      let programTitle = item.programName ? item.programName.trim() : 'No Program Name';
      let programDescription = 'from 3BB'; // undefined;

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

const getEpgDataFromTrueId = async () => {
  console.log('Fetching epg data from trueID...');

  const channelSlugToChannelKey = {
    nbt: 'nbt',
    ch5: 'tv5',
    't-sports-7-sd': 'tsports',
    workpointtv: 'workpoint',
    'pptv-hd': 'pptv',
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
    Object.keys(channelSlugToChannelKey)
      .map(async (channelSlug) => {
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
              `trueid_epg response error on ${channelSlug} => ${error.response.status}: ${error.response.data}`,
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
      .filter((a) => a !== null && a !== undefined),
  );

  // process data
  const epgData = [];

  for (const pageProps of allPageProps) {
    if (pageProps === null || pageProps.channelSlug === undefined) continue;

    const channelKey = channelSlugToChannelKey[pageProps.channelSlug];
    if (!channelKey) continue;

    for (const program of pageProps.epgList) {
      if (program.status === false) {
        continue;
      }
      const programStartStr = `${program.start_date.slice(0, 19).replace(/-|:|T/g, '')} +0000`;
      const programEndStr = `${program.end_date.slice(0, 19).replace(/-|:|T/g, '')} +0000`;
      const programTitle = program.title ? program.title.trim() : 'No Program Name';
      let programDescription = (program.info && program.info.synopsis_th) || '';
      programDescription = programDescription ? `${programDescription} (from trueID)` : 'from trueID';
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
  let epgDataFrom3bbPromise = getEpgDataFrom3bb();
  let epgDataFromTrueIdPromise = getEpgDataFromTrueId();

  const [epgDataFromNbtc, epgDataFrom3bb, epgDataFromTrueId] = await Promise.all([
    epgDataFromNbtcPromise,
    epgDataFrom3bbPromise,
    epgDataFromTrueIdPromise,
  ]);

  let mergedEpgData = [...epgDataFromNbtc, ...epgDataFrom3bb, ...epgDataFromTrueId];
  mergedEpgData = mergedEpgData.sort((item1, item2) => {
    const channelCompare = item1.channelKey.localeCompare(item2.channelKey);
    if (channelCompare !== 0) return channelCompare;

    return item1.programStartStr.localeCompare(item2.programStartStr);
  });

  return mergedEpgData;
};

module.exports = getEpgData;
