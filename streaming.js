const axios = require('axios');

const defaultOptions =
  '#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36';
const currentDatetimePlus7Hrs = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
const currentBkkDatetimeStr = currentDatetimePlus7Hrs.toISOString().slice(0, 16);

const streamingInfo = {
  nbt: {
    channelName: 'NBT HD',
    logo: 'https://iptv36.my.to/logo/nbt.png',
    tvgId: 'NBT2.th',
    sources: [
      { url: 'https://cdn6.goprimetime.info/feed/202205171929/chnbt3/index.m3u8', options: defaultOptions },
      'http://freelive2.inwstream.com:1935/freelive-edge/nbt/playlist.m3u8',
      'https://freelive.inwstream.com:1936/freelive-edge/nbt/playlist.m3u8',
    ],
  },

  thaipbs: {
    channelName: 'Thai PBS HD',
    logo: 'https://iptv36.my.to/logo/thaipbs.png',
    tvgId: 'ThaiPBS3.th',
    sources: [
      'https://thaipbs-live.cdn.byteark.com/live/playlist_1080p/index.m3u8', // 1080p
    ],
  },

  altv: {
    channelName: 'ALTV HD',
    logo: 'https://iptv36.my.to/logo/altv.png',
    sources: ['https://thaipbs-ujxrch.cdn.byteark.com/live/playlist.m3u8'], // 1080p auto
  },

  tv5: {
    channelName: 'TV5 HD',
    logo: 'https://iptv36.my.to/logo/tv5.png',
    tvgId: 'ThaiTV5HD1.th',
    sources: [
      'http://110.170.117.27:1935/apptv5hd1live/vdo-tv5hd1/playlist.m3u8', // 1080p
      'http://freelive.inwstream.com:1935/freelive-edge/5hd/playlist.m3u8', // 720p
    ],
  },

  tsports: {
    channelName: 'T-Sports',
    logo: 'https://iptv36.my.to/logo/tsports.png',
    sources: [
      { url: 'https://cdn6.goprimetime.info/feed/202205171929/chtsport/index.m3u8' /* options: defaultOptions */ },
    ],
  },

  tptv: {
    channelName: 'TPTV',
    logo: 'https://iptv36.my.to/logo/tptv.png',
    sources: ['http://freelive2.inwstream.com:1935/freelive-edge/tptv/playlist.m3u8'],
  },

  tnn16: {
    channelName: 'TNN16',
    logo: 'https://iptv36.my.to/logo/tnn16.png',
    tvgId: 'TNN16.th',
    sources: [
      { url: 'https://iptv36.netlify.app/api/true?channel=tnn16hd', suffix: 'HD' }, // 720p
      'http://freelive2.inwstream.com:1935/freelive-edge/tnn24/playlist.m3u8',
    ],
  },

  jkn18: {
    channelName: 'JKN18 ',
    logo: 'https://iptv36.my.to/logo/jkn18.jpg',
    tvgId: 'JKN18.th',
    sources: [
      { url: 'https://5f27aa1f6ef91.streamlock.net/jkncnbc/myStream/playlist.m3u8', suffix: 'HD' },
      { url: 'https://cdn6.goprimetime.info/feed/202205171929/newtv/index.m3u8', options: defaultOptions },
    ],
  },

  nation: {
    channelName: 'Nation TV',
    logo: 'https://iptv36.my.to/logo/nation.png',
    tvgId: 'NationTV.th',
    sources: ['http://freelive2.inwstream.com:1935/freelive-edge/nation/playlist.m3u8'],
  },

  workpoint: {
    channelName: 'Workpoint TV',
    logo: 'https://iptv36.my.to/logo/workpoint.png',
    tvgId: 'Workpoint23.th',
    sources: ['http://freelive.inwstream.com:1935/freelive-edge/workpointtv/playlist.m3u8'],
  },

  true4u: {
    channelName: 'True4U',
    logo: 'https://iptv36.my.to/logo/true4u.png',
    tvgId: 'True4U.th',
    sources: [
      'https://iptv36.netlify.app/api/true?channel=true4uhd',
      'http://freelive.inwstream.com:1935/freelive-edge/true4u/playlist.m3u8',
    ],
  },

  gmm25: {
    channelName: 'GMM25',
    logo: 'https://iptv36.my.to/logo/gmm25.png',
    tvgId: 'GMM25.th',
    sources: [
      'https://freelive.inwstream.com:1936/freelive-edge/gmmchannel/playlist.m3u8',
      'http://freelive2.inwstream.com:1935/freelive-edge/gmmchannel/playlist.m3u8',
    ],
  },

  ch8: {
    channelName: 'CH8',
    logo: 'https://iptv36.my.to/logo/ch8.png',
    tvgId: 'ThaiChannel8.th',
    sources: [
      { url: 'https://prsmedia-mykojh.cdn.byteark.com/fleetstream/live/720p/index.m3u8', suffix: 'HD' }, // 720p
      'http://freelive.inwstream.com:1935/freelive-edge/ch8/playlist.m3u8', // 720p
    ],
  },

  mono29: {
    channelName: 'MONO29',
    logo: 'https://iptv36.my.to/logo/mono29.png',
    tvgId: 'Mono29.th',
    sources: [
      'https://edge4-bkk.3bb.co.th:9443/Stream_HLSMONO29_1080P/mono29hls_1080TH.stream/playlist.m3u8',
      'http://freelive.inwstream.com:1935/freelive-edge/mono29/playlist.m3u8',
    ],
  },

  mono29soundtrack: {
    channelName: 'MONO29 Soundtrack',
    logo: 'https://iptv36.my.to/logo/mono29.png',
    tvgId: 'Mono29.th',
    sources: [
      'https://edge4-bkk.3bb.co.th:9443/Stream_HLSMONO29_1080P/mono29hls_1080EN.stream/playlist.m3u8', // 720p
    ],
  },

  mcot: {
    channelName: 'MCOT HD',
    logo: 'https://iptv36.my.to/logo/mcot.png',
    tvgId: 'MCOTHD.th',
    sources: ['http://freelive2.inwstream.com:1935/freelive-edge/mcothd/playlist.m3u8'],
  },

  one: {
    channelName: 'ONE HD',
    logo: 'https://iptv36.my.to/logo/one.png',
    tvgId: 'One31.th',
    sources: [
      'http://freelive2.inwstream.com:1935/freelive-edge/onehd/playlist.m3u8',
      'https://freelive.inwstream.com:1936/freelive-edge/onehd/playlist.m3u8',
    ],
  },

  thairath: {
    channelName: 'Thairath TV HD',
    logo: 'https://iptv36.my.to/logo/thairath.png',
    tvgId: 'ThairathTV32.th',
    sources: [
      'http://freelive2.inwstream.com:1935/freelive-edge/thairahttvhd/playlist.m3u8', // 720p
      'https://live.thairath.co.th/trtv2/playlist_720p/index.m3u8', // 720p low-bitrate
    ],
  },

  ch3: {
    channelName: 'CH3',
    logo: 'https://iptv36.my.to/logo/ch3.png',
    tvgId: 'Channel3.th',
    sources: [
      ['HD', 'http://freelive2.inwstream.com:1935/freelive-edge/3hd/playlist.m3u8'],
      ['HD', 'https://freelive.inwstream.com:1936/freelive-edge/3hd/playlist.m3u8'],
    ],
  },

  amarin: {
    channelName: 'Amarin TV HD',
    logo: 'https://iptv36.my.to/logo/amarin.png',
    tvgId: 'Amarin34HD.th',
    sources: [
      'https://amarin-ks7jcc.cdn.byteark.com/fleetstream/amarin-live/index.m3u8?x_ark_access_id=fleet-868&x_ark_auth_type=ark-v2&x_ark_expires=1666561048&x_ark_path_prefix=%2Ffleetstream%2Famarin-live%2F&x_ark_signature=LBD1E-50LtHXZd1RZISPaw',
      'http://freelive2.inwstream.com:1935/freelive-edge/amarinhd/playlist.m3u8', // 720p
      'https://freelive.inwstream.com:1936/freelive-edge/amarinhd/playlist.m3u8', // 720p
    ],
  },

  ch7: {
    channelName: 'CH7',
    logo: 'https://iptv36.my.to/logo/ch7.png',
    tvgId: 'BBTVChannel7.th',
    sources: [
      ['HD', 'https://live-cdn-hwc.ch7.com/livech7hd/HD_1080p.m3u8?vhost=streaming-hwc.ch7.com'], // 1080p
      ['HD', 'http://freelive2.inwstream.com:1935/freelive-edge/7hd/playlist.m3u8'], // 720p
    ],
  },

  pptv: {
    channelName: 'PPTV',
    logo: 'https://iptv36.my.to/logo/pptv.png',
    tvgId: 'PPTVHD36.th',
    sources: [
      ['HD', 'http://freelive2.inwstream.com:1935/freelive-edge/pptvhd/playlist.m3u8'],
      [
        'HD',
        'https://pptv36-1tsjfj.cdn.byteark.com/live/playlist.m3u8?x_ark_access_id=fleet-963&x_ark_auth_type=ark-v2&x_ark_expires=1666522801&x_ark_path_prefix=%2Flive%2F&x_ark_signature=dEjXmLbWRPllW2EnhTJnPw',
      ],
    ],
  },

  cartoonclub: {
    channelName: 'Cartoon Club',
    logo: 'https://iptv36.my.to/logo/cartoonclub.png',
    sources: ['https://edge1-bkk.3bb.co.th:9443/cartoonLiveApp/cartoonLiveApp.stream/chunklist_w859044783.m3u8'],
  },

  ctb: {
    channelName: 'CTB',
    logo: 'https://iptv36.my.to/logo/ctb.png',
    sources: ['http://vip.login.in.th:1935/CTB/CTB/chunklist.m3u8'],
  },

  fwmov: {
    channelName: 'FW Movie',
    logo: 'https://www.inwiptv.com/postor/20200512164154fwmov.jpg',
    sources: ['http://freelive.inwstream.com:1935/freelive-edge/fwmov_fw-iptv.stream/playlist.m3u8'],
  },

  fwsov: {
    channelName: 'FW Sov',
    logo: 'https://www.inwiptv.com/postor/20200512165346fwsov.jpg',
    sources: ['http://freelive.inwstream.com:1935/freelive-edge/fwsov_fw-iptv.stream/playlist.m3u8'],
  },

  fwtoon: {
    channelName: 'FW Toon',
    logo: 'https://www.inwiptv.com/postor/20200512162950fw%20teletoon(1).jpg',
    sources: ['https://freelive.inwstream.com:1936/freelive-edge/fwtoon_fw-iptv.stream/playlist.m3u8'],
  },

  ipcam: {
    channelName: 'CAM',
    logo: 'https://iptv36.my.to/logo/ipcam.png',
    sources: [
      ['01 Park-164', 'rtsp://admin@192.168.1.201:554/mpeg4/ch1/main/av_stream'],
      ['02 Park-163', 'rtsp://admin@192.168.1.202:554/mpeg4/ch1/main/av_stream'],
      ['03 Toilet-163', 'rtsp://admin@192.168.1.203:554/mpeg4/ch1/main/av_stream'],
      ['04 Door-163', 'rtsp://admin@192.168.1.204:554/mpeg4/ch1/main/av_stream'],
      ['06 Kitchen', 'rtsp://admin@192.168.1.206:554/mpeg4/ch1/main/av_stream'],
      ['07 Floor-2', 'rtsp://admin@192.168.1.207:554/mpeg4/ch1/main/av_stream'],
      ['09 Com-TV', 'rtsp://admin@192.168.1.209:554/mpeg4/ch1/main/av_stream'],
      ['10 Com-Ying', 'rtsp://admin@192.168.1.210:554/mpeg4/ch1/main/av_stream'],
      ['11 Bed-1', 'rtsp://admin@192.168.1.211:554/mpeg4/ch1/main/av_stream'],
    ],
    groupName: 'IP CAM',
  },

  news1: {
    channelName: 'NEWS1',
    logo: 'https://iptv36.my.to/logo/news1.png',
    sources: ['http://server1.streamssl.com/stream/news1_hi.m3u8', 'http://news1.live14.com/stream/news1_hi.m3u8'],
  },

  tvb: {
    channelName: 'TVB Thai HD',
    logo: 'https://iptv36.my.to/logo/tvb.png',
    sources: [
      'https://edge2z.v2h-cdn.com/tvb_thai/tvb_thai.stream/playlist.m3u8', // 1080p
    ],
  },

  topnews: {
    channelName: 'Top News HD',
    logo: 'https://images.topnews.co.th/2021/04/cropped-topnews-logo.png',
    sources: ['https://live.topnews.co.th/hls/topnews_b_720.m3u8'],
  },
};

const dynamicallyAddStreamingUrlFromDailyMotion = async () => {
  console.log('Getting dynamic streaming url from dailymotion...');

  // config
  let config = [
    // [channelKey, channelNameSuffix, pageUrl, appendUrlToBottom=false]
    ['workpoint', 'HD', 'https://www.dailymotion.com/player/metadata/video/x6g9qjj'],
    ['nation', 'HD', 'https://www.dailymotion.com/player/metadata/video/x6eoldf'],
    ['topnews', '', 'https://www.dailymotion.com/player/metadata/video/x8aopdx'],
  ];

  let result = {};
  await Promise.all(
    config.map(async ([channelKey, channelNameSuffix, pageUrl, appendUrlToBottom = false]) => {
      let videoMetaData = {};
      try {
        const response = await axios.get(pageUrl);
        videoMetaData = response.data;
      } catch (error) {
        console.error(`Cannot extract playlist for channel ${channelKey}`);
        console.error(error);
      }

      let livePlayListUrl = '';
      try {
        livePlayListUrl = videoMetaData.qualities.auto[0].url;
      } catch (error) {
        console.error(`Cannot get live playlist url for channel ${channelKey}`);
        console.error(error);
        console.error(videoMetaData);
      }

      if (livePlayListUrl) {
        try {
          const response = await axios.get(livePlayListUrl);
          let rawPlayList = response.data;

          for (let i = 4; i >= 0; i--) {
            let regExp = new RegExp(`https:\/\/.*?\/live-[${i}]\.m3u8`);
            let regExpMatchArray = rawPlayList.match(regExp);

            if (regExpMatchArray) {
              if (!(channelKey in streamingInfo)) {
                console.error(`Not recognize channel ${channelKey}`);
                return;
              }
              let url = regExpMatchArray[0].replace('.nyc.', '.sg1.');
              if (appendUrlToBottom) {
                streamingInfo[channelKey].sources.push([channelNameSuffix, url]);
              } else {
                streamingInfo[channelKey].sources.unshift([channelNameSuffix, url]);
              }
              break;
            }
          }
        } catch (error) {
          console.error(`Cannot extract playlist for channel ${channelKey}`);
          console.error(error);
        }
      }
    })
  );
};

const testUrl = async (url) => {
  // list of url that we will always not check
  if (
    url.includes('rtsp://') ||
    url.includes('ultratv.one') ||
    url.includes('27.254.142.207') || // m channel
    url.includes('streamlock.net') || // jkn
    url.includes('live-cdn-hwc.ch7.com') ||
    url.includes('/api/true') // tnn
  ) {
    return true;
  }

  const maximumRetry = 2;
  let attempt = 0;
  let errorMessageArray = [];

  while (attempt < maximumRetry) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return true;
    } catch (error) {
      let errorMsg = error.code || error.response.status;

      if (
        process.env.NETLIFY &&
        (url.includes('3bb.co.th') ||
          url.includes('prsmedia') ||
          url.includes('login.in.th') ||
          url.includes('googleuservideo.com'))
      ) {
        return true;
      }

      if (errorMsg === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' && url.includes('freelive.inwstream.com')) {
        return true;
      }

      if (
        process.env.NETLIFY &&
        errorMsg === 'ECONNRESET' &&
        (url.includes('stream.rs.co.th') || url.includes('bugaboo.tv'))
      ) {
        return true;
      }

      if (process.env.NETLIFY && errorMsg === 451 && url.includes('byteark.com')) {
        return true;
      }

      errorMessageArray.push(errorMsg);
      await new Promise((resolve) => setTimeout(resolve, 300));
      attempt += 1;
    }
  }

  return Array.from(new Set(errorMessageArray)).join(' / ');
};

const generateValidUrl = async (streamingData) => {
  // find invalidUrlList
  let invalidUrlList = [];
  await Promise.all(
    streamingData.sources.map(async (url) => {
      let urlForTest = url;
      if (Array.isArray(url)) {
        urlForTest = url[1];
      } else if (typeof url === 'object') {
        urlForTest = url.url;
      }

      if (urlForTest === undefined) {
        console.log(url);
      }

      let result = await testUrl(urlForTest);
      if (result !== true) {
        console.log(`  X ${streamingData.channelName} - ${result}\n    ${urlForTest}`);
        invalidUrlList.push(urlForTest);
      }
    })
  );

  // create validUrlList
  streamingData.validUrlList = [];
  for (let i = 0; i < streamingData.sources.length; i++) {
    let url = streamingData.sources[i];
    let urlForTest = url;
    if (Array.isArray(url)) {
      urlForTest = url[1];
    } else if (typeof url === 'object') {
      urlForTest = url.url;
    }

    if (invalidUrlList.includes(urlForTest)) {
      continue;
    }
    streamingData.validUrlList.push(url);
  }
};

const getStreamingInfo = async (channelKey, skip = 0) => {
  let streamingData = streamingInfo[channelKey] || {};

  // check validUrlList available or not
  if (streamingData.validUrlList === undefined) {
    await generateValidUrl(streamingData);
  }

  let channelNameComponent = [streamingData.channelName];
  let logo = streamingData.logo || 'https://iptv36.my.to/logo/blank.png';
  let groupName = 'Main';
  let tvgId = streamingData.tvgId || '';
  let sources = streamingData.validUrlList || [];

  let url = '';
  let options = '';
  if (sources.length > 0) {
    url = skip < sources.length ? sources[skip] : sources[0];
  } else {
    channelNameComponent.unshift('[เสีย]');
    url = skip < streamingData.sources.length ? streamingData.sources[skip] : streamingData.sources[0];
  }

  if (Array.isArray(url)) {
    channelNameComponent.push(url[0]);
    url = url[1];
  } else if (typeof url === 'object') {
    if (url.options) {
      options = url.options;
    }
    if (url.suffix) {
      channelNameComponent.push(url.suffix);
    }
    url = url.url;
  }

  if (channelKey !== 'ipcam' && skip > 0) {
    channelNameComponent.push(`Backup${skip > 1 ? skip : ''}`);
    groupName = 'Backup';
  }
  let channelName = channelNameComponent.join(' ');

  return { channelName, logo, groupName, tvgId, url, options };
};

module.exports = {
  getStreamingInfo,
  dynamicallyAddStreamingUrlFromDailyMotion,
  // dynamicallyAddStreamingUrlByDetectM3U8Url,
};
