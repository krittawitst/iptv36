const axios = require('axios');
const cheerio = require('cheerio');
const get = require('lodash/get');

const defaultUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0';

const streamingInfo = {
  nbt: {
    channelName: 'NBT',
    logo: 'https://iptv36.vercel.app/logo/nbt.png?v=2',
    // tvgId: 'NBT2.th',
    sources: [
      {
        url: 'https://cdn-edge-ott.prd.go.th/live_vlc/smil:c30f-97f7-c767-ca64-98aa.smil/playlist.m3u8',
        suffix: 'FHD',
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/fffe/nbt/nbt.m3u8', suffix: 'HD' },
    ],
  },

  thaipbs: {
    channelName: 'Thai PBS',
    logo: 'https://iptv36.vercel.app/logo/thaipbs.png',
    // tvgId: 'ThaiPBS3.th',
    sources: [
      { url: 'https://thaipbs-live.cdn.byteark.com/live/playlist.m3u8', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/fffd/tpbs/tpbs.m3u8', suffix: 'HD' },
    ],
  },

  altv: {
    channelName: 'ALTV',
    logo: 'https://iptv36.vercel.app/logo/altv.png',
    sources: [
      { url: 'https://thaipbs-ujxrch.cdn.byteark.com/live/playlist.m3u8', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/fffc/altv/altv.m3u8' },
    ],
  },

  tv5: {
    channelName: 'TV5',
    logo: 'https://iptv36.vercel.app/logo/tv5.png',
    // tvgId: 'ThaiTV5HD1.th',
    sources: [
      { url: 'https://639bc5877c5fe.streamlock.net/tv5hdlive/tv5hdlive/playlist.m3u8', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/fffb/5hd/5hd.m3u8', suffix: 'HD' },
    ],
  },

  tsports: {
    channelName: 'T-Sports',
    logo: 'https://iptv36.vercel.app/logo/tsports.png',
    sources: [
      { url: ' https://lb1-live-mv.v2h-cdn.com/hls/ffef/tsport/tsport.m3u8' },
      {
        url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/t-sport-7/playlist.m3u8',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
    ],
  },

  tptv: {
    channelName: 'TPTV',
    logo: 'https://iptv36.vercel.app/logo/tptv.png',
    sources: [
      { url: 'https://tv-live.tpchannel.org/live/tv_1080p.m3u8?vhost=tv-live.tpchannel.org', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffec/tptv/tptv.m3u8' },
    ],
  },

  tnn16: {
    channelName: 'TNN16',
    logo: 'https://iptv36.vercel.app/logo/tnn16.png',
    // tvgId: 'TNN16.th',
    sources: [
      // { url: 'https://iptv36.vercel.app/api/true.m3u8?channel=tnn16', suffix: 'HD' },
      {
        url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/tnn24_1080p/playlist.m3u8',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffdc/tnn/tnn.m3u8' },
    ],
  },

  jkn18: {
    channelName: 'JKN18',
    logo: 'https://iptv36.vercel.app/logo/jkn18.png',
    // tvgId: 'JKN18.th',
    sources: [
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffda/jkn18/jkn18.m3u8' },
      { url: 'https://live.topnews.co.th/hls/topnews_a_720.m3u8', suffix: 'Top News HD', priority: 9 },
    ],
  },

  nation: {
    channelName: 'Nation TV',
    logo: 'https://iptv36.vercel.app/logo/nation.png',
    // tvgId: 'NationTV.th',
    sources: [
      {
        url: 'https://nationtv-1jdcjo.cdn.byteark.com/fleetstream/nationtvlive/index.m3u8',
        suffix: 'FHD',
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffcc/nation/nation.m3u8' },
    ],
  },

  workpoint: {
    channelName: 'Workpoint TV',
    logo: 'https://iptv36.vercel.app/logo/workpoint.png',
    // tvgId: 'Workpoint23.th',
    sources: [
      { url: 'https://global-media.sooplive.com/live/workpoint/master.m3u8', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffcb/workpoint/workpoint.m3u8' },
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/23/23.mpd', priority: 9 },
    ],
  },

  true4u: {
    channelName: 'True4U',
    logo: 'https://iptv36.vercel.app/logo/true4u.png',
    // tvgId: 'True4U.th',
    sources: [
      { url: 'https://iptv36.vercel.app/api/true.m3u8?channel=true4u', suffix: 'HD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffca/true24/true24.m3u8' },
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/24/24.mpd', priority: 9 },
    ],
  },

  gmm25: {
    channelName: 'GMM25',
    logo: 'https://iptv36.vercel.app/logo/gmm25.png',
    // tvgId: 'GMM25.th',
    sources: [
      {
        url: 'https://bcovlive-a.akamaihd.net/57d4bf695e80436d9335f4f50adbe438/ap-southeast-1/6415628290001/7e85dc4a59904e45b4fdffebd62e1d82/playlist_ssaiM.m3u8',
        suffix: 'FHD',
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffbf/gmm25/gmm25.m3u8' },
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/25/25.mpd', priority: 9 },
    ],
  },

  ch8: {
    channelName: 'CH8',
    logo: 'https://iptv36.vercel.app/logo/ch8.png',
    // tvgId: 'ThaiChannel8.th',
    sources: [
      { url: 'https://prsmedia-mykojh.cdn.byteark.com/fleetstream/live/720p/index.m3u8', suffix: 'HD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffbe/ch8/ch8.m3u8' },
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/27/27.mpd', priority: 9 },
    ],
  },

  mono29: {
    channelName: 'MONO29',
    logo: 'https://iptv36.vercel.app/logo/mono29.png',
    // tvgId: 'Mono29.th',
    sources: [
      {
        url: 'https://streaming.monomax.me/Mono29LiveStream/ngrp:myStream_all/chunklist_b6628000.m3u8',
        suffix: 'FHD',
        priority: 35,
      },
      {
        url: 'https://edge4-bkk.3bb.co.th:9443/Stream_HLSMONO29_1080P/mono29hls_1080TH.stream/playlist.m3u8',
        suffix: 'FHD',
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffbc/mono29/mono29.m3u8' },
    ],
  },

  mono29soundtrack: {
    channelName: 'MONO29 Soundtrack',
    logo: 'https://iptv36.vercel.app/logo/mono29.png',
    tvgId: 'iptv36.mono29',
    sources: [
      {
        url: 'https://edge4-bkk.3bb.co.th:9443/Stream_HLSMONO29_1080P/mono29hls_1080EN.stream/playlist.m3u8',
        suffix: 'FHD',
      },
    ],
  },

  mcot: {
    channelName: 'MCOT',
    logo: 'https://iptv36.vercel.app/logo/mcot.png',
    // tvgId: 'MCOTHD.th',
    sources: [
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/30/30.mpd', suffix: 'FHD', priority: 35 },
      { url: 'https://live-org-01-cdn.mcot.net/mcothd1080p_edge/smil:mcothd1080p.smil/playlist.m3u8', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffbb/mcot/mcot.m3u8', suffix: 'FHD' },
    ],
  },

  one: {
    channelName: 'ONE',
    logo: 'https://iptv36.vercel.app/logo/one.png',
    // tvgId: 'One31.th',
    sources: [
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/31/31.mpd', suffix: 'FHD' },
      {
        url: 'https://bcovlive-a.akamaihd.net/b6603a14ea59440a95e9235e14bc9332/ap-southeast-1/6415628290001/9c3d7fc7d10840a69e48b5939ae886e0/playlist_ssaiM.m3u8',
        suffix: 'FHD',
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffba/one/one.m3u8', suffix: 'HD' },
    ],
  },

  thairath: {
    channelName: 'Thairath TV',
    logo: 'https://iptv36.vercel.app/logo/thairath.png',
    // tvgId: 'ThairathTV32.th',
    sources: [
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/32/32.mpd', suffix: 'FHD' },
      {
        url: 'https://cdn1.googlecdn.live/4k/thairathtv/playlist.m3u8',
        options: { referer: 'https://soccertv4k.com/' },
        suffix: 'FHD',
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffaf/thairath/thairath.m3u8', suffix: 'HD' },
      {
        url: 'https://streaming-web.thairath.co.th/live/playlist_hd/index.m3u8',
        options: { referer: 'https://www.thairath.co.th/' },
        suffix: 'HD',
      },
    ],
  },

  ch3: {
    channelName: 'CH3',
    logo: 'https://iptv36.vercel.app/logo/ch3.png',
    // tvgId: 'Channel3.th',
    sources: [
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/33/33.mpd', suffix: 'FHD' },
      {
        url: 'https://cdn1.googlecdn.live/4k/ch3hd/playlist.m3u8',
        suffix: 'FHD',
        options: { referer: 'https://soccertv4k.com/' },
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffae/3hd/3hd.m3u8', suffix: 'HD' },
    ],
  },

  amarin: {
    channelName: 'Amarin TV',
    logo: 'https://iptv36.vercel.app/logo/amarin.png',
    // tvgId: 'Amarin34HD.th',
    sources: [
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/34/34.mpd', suffix: 'FHD' },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffad/amarin/amarin.m3u8', suffix: 'HD' },
      {
        url: 'https://cdn1.googlecdn.live/4k/amarintv/playlist.m3u8',
        options: { referer: 'https://soccertv4k.com/' },
      },
    ],
  },

  ch7: {
    channelName: 'CH7',
    logo: 'https://iptv36.vercel.app/logo/ch7.png',
    // tvgId: 'BBTVChannel7.th',
    sources: [
      { url: 'https://live-cdn-hwc.ch7.com/livech7hd/HD_1080p.m3u8?vhost=streaming-hwc.ch7.com', suffix: 'FHD' },
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/35/35.mpd', suffix: 'FHD' },
      {
        url: 'https://cdn1.googlecdn.live/4k/ch7hd/playlist.m3u8',
        suffix: 'SoccerTV FHD',
        options: { referer: 'https://soccertv4k.com/' },
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffac/7hd/7hd.m3u8', suffix: 'HD' },
    ],
  },

  pptv: {
    channelName: 'PPTV',
    logo: 'https://iptv36.vercel.app/logo/pptv.png',
    // tvgId: 'PPTVHD36.th',
    sources: [
      { url: 'https://cco-streamer1.cdn.3bbtv.com:8443/3bb/live/36/36.mpd', suffix: 'FHD' },
      {
        url: 'https://cdn1.googlecdn.live/4k/pptv/playlist.m3u8',
        suffix: 'FHD',
        options: { referer: 'https://soccertv4k.com/' },
      },
      { url: 'https://lb1-live-mv.v2h-cdn.com/hls/ffab/pptv/pptv.m3u8', suffix: 'HD' },
    ],
  },

  cartoonclub: {
    channelName: 'Cartoon Club',
    logo: 'https://iptv36.vercel.app/logo/cartoonclub.png',
    groupName: 'Other',
    sources: [
      {
        url: 'https://edge2-bkk.3bb.co.th:9443/Web_CartoonClub_Live/cartoonclub_480P.stream/chunklist.m3u8',
      },
    ],
  },

  boomerang: {
    channelName: 'Boomerang',
    logo: 'https://ais-s.ais-vidnt.com/ais/play/origin/LIVE/channelicon/Boomerang2024.png',
    groupName: 'Other',
    sources: [],
  },

  tvb: {
    channelName: 'TVB Thai FHD',
    logo: 'https://iptv36.vercel.app/logo/tvb.png',
    groupName: 'Other',
    sources: [
      {
        url: 'https://n-edge-1-th.v2h-cdn.com/tvb_m/tvb_thai/playlist.m3u8',
      },
    ],
  },

  samrujlok: {
    channelName: 'สำรวจโลก',
    logo: 'https://i0.wp.com/www.nextsteptv.com/wp-content/uploads/2017/06/Samrulok_logo_on_top.jpg',
    groupName: 'Other',
    sources: [
      {
        url: 'https://cdn6.goprimetime.info/feed/eI5rczhSQpWBcgOtqRLNWw/LC8/index.m3u8',
        options: { userAgent: defaultUserAgent },
      },
    ],
  },

  lovenature: {
    channelName: 'Love Nature 4K',
    logo: 'https://cdn6.aptoide.com/imgs/5/1/7/51713cb38f60e82562a65727ce7d5493_icon.png?w=128',
    groupName: 'Other',
    sources: [
      {
        url: 'https://d18dyiwu97wm6q.cloudfront.net/playlist.m3u8',
        options: { userAgent: defaultUserAgent },
      },
    ],
  },

  bein1: {
    channelName: 'beIN Sports 1',
    logo: 'https://i.imgur.com/Vtk2cGI.png',
    // tvgId: 'beINSports1Thailand.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-6/playlist.m3u8',
        // url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-6/playlist.m3u8',
        suffix: 'ThaiM3U',
        options: { referer: 'https://live-demo.iamtheme.com/' },
        priority: 11,
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/bein1/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
        priority: 10,
      },
      {
        url: 'https://cdn1.googlecdn.live/4k/bein1/playlist.m3u8',
        suffix: 'SoccerTV Delay',
        options: { referer: 'https://soccertv4k.com/' },
        priority: 9,
      },
    ],
  },

  bein2: {
    channelName: 'beIN Sports 2',
    logo: 'https://i.imgur.com/vUJZSvs.png',
    // tvgId: 'beINSports2Thailand.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://cdn1.googlecdn.live/4k/bein2/playlist.m3u8',
        suffix: 'SoccerTV FHD',
        options: { referer: 'https://soccertv4k.com/' },
      },
      {
        url: 'https://fw4free.inwstream.com/fw4free/bein2.stream/playlist.m3u8',
        suffix: 'inw HD',
        options: { referer: 'https://fw4free.com/' },
      },
    ],
  },

  bein3: {
    channelName: 'beIN Sports 3',
    logo: 'https://i.imgur.com/UYSMao3.png',
    // tvgId: 'beINSports3Thailand.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-7/playlist.m3u8',
        // url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-7/playlist.m3u8',
        suffix: 'ThaiM3U HD',
        options: { referer: 'https://live-demo.iamtheme.com/' },
        priority: 21,
      },
      {
        url: 'https://fw4free.inwstream.com/fw4free/bein3.stream/playlist.m3u8',
        suffix: 'inw HD',
        options: { referer: 'https://fw4free.com/' },
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/bein3/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
      },
      // {
      //   url: 'https://cdn-stream.lnwza007.com/ballmun/sd6/chunks.m3u8',
      //   suffix: 'lnwza Delay HD',
      //   // options: { referer: 'https://live-demo.iamtheme.com/' },
      //   priority: 9,
      // },
    ],
  },

  premier1: {
    channelName: 'Premier 1',
    logo: 'https://iptv36.vercel.app/logo/premier_hd1.png',
    // tvgId: 'TruePremierFootball1.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://r3-sn-5fo-c37ed248.googleuservideo.com:8443/Premier1_720/tracks-v1a1/mono.m3u8?token=c2VydmVyX3RpbWU9MTAvMTYvMjAyNCAwMTozODo0OCBBTSZoYXNoX3ZhbHVlPXNNOURSekVJZDhSSTFJTzdYRVd2bVE9PSZ2YWxpZG1pbnV0ZXM9NSZzdHJtX2xlbj0wJmlkPXdlYi0xMzg1NzU=',
        suffix: 'DooFlix FHD',
        priority: 31,
      },
      {
        url: 'https://cdn1.googlecdn.live/4k/epl1_sd/playlist.m3u8',
        suffix: 'SoccerTV Delay HD',
        options: { referer: 'https://soccertv4k.com/' },
      },
      {
        url: 'https://cdn-stream.lnwza007.com/ballmun/sd1/chunks.m3u8',
        suffix: 'lnwza HD',
        // options: { referer: 'https://soccertv4k.com/' },
      },
      {
        url: 'https://playtvthai.github.io/m3u8/sports/epl1.m3u8',
        suffix: 'PlayTV Delay HD',
        // options: { referer: 'https://soccertv4k.com/' },
      },
      {
        url: 'https://fw4free.inwstream.com/fw4free/ch1.stream/playlist.m3u8',
        suffix: 'inw HD',
        options: { referer: 'https://fw4free.com/' },
      },
      {
        url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-1/playlist.m3u8',
        // url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-1/playlist.m3u8',
        // url: 'https://dolive.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-1/playlist.m3u8',
        suffix: 'ThaiM3U',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/tpf1/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
      },
    ],
  },

  premier2: {
    channelName: 'Premier 2',
    logo: 'https://iptv36.vercel.app/logo/premier_hd2.png',
    // tvgId: 'TruePremierFootball2.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://cdn1.googlecdn.live/4k/epl2/playlist.m3u8',
        suffix: 'SoccerTV FHD',
        options: { referer: 'https://soccertv4k.com/' },
      },
      {
        url: 'https://playtvthai.github.io/m3u8/sports/epl2.m3u8',
        suffix: 'PlayTV HD',
        // options: { referer: 'https://soccertv4k.com/' },
      },
      {
        url: 'https://fw4free.inwstream.com/fw4free/ch2.stream/playlist.m3u8',
        suffix: 'inw HD',
        options: { referer: 'https://fw4free.com/' },
      },
      {
        // url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-2/playlist.m3u8',
        url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-2/playlist.m3u8',
        suffix: 'ThaiM3U',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/tpf2/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
      },
    ],
  },

  premier3: {
    channelName: 'Premier 3',
    logo: 'https://iptv36.vercel.app/logo/premier_hd3.png',
    // tvgId: 'TruePremierFootball3.th',
    groupName: 'Sport',
    sources: [
      {
        // url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-3/playlist.m3u8',
        url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-3/playlist.m3u8',
        suffix: 'ThaiM3U',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/tpf3/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
      },
    ],
  },

  premier4: {
    channelName: 'Premier 4',
    logo: 'https://iptv36.vercel.app/logo/premier_hd4.png',
    // tvgId: 'TruePremierFootball4.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-4/playlist.m3u8',
        // url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-4/playlist.m3u8',
        suffix: 'ThaiM3U',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/tpf4/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
      },
    ],
  },

  premier5: {
    channelName: 'Premier 5',
    logo: 'https://iptv36.vercel.app/logo/premier_hd5.png',
    // tvgId: 'TruePremierFootball5.th',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://oral.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-5/playlist.m3u8',
        // url: 'https://switch.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-5/playlist.m3u8',
        suffix: 'ThaiM3U',
        options: { referer: 'https://live-demo.iamtheme.com/' },
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/tpf5/playlist.m3u8',
        suffix: 'Bunny',
        options: { referer: 'https://www.andaman888th.com/' },
      },
    ],
  },

  truesportshd1: {
    channelName: 'True Sports 1',
    logo: 'https://iptv36.vercel.app/logo/true_sports_hd.png',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/truesporthd1/playlist.m3u8',
        options: { referer: 'https://www.andaman888th.com/' },
        suffix: 'Bunny FHD',
      },
      {
        url: 'https://cdn1.googlecdn.live/4k/tsp1/playlist.m3u8',
        options: { referer: 'https://soccertv4k.com/' },
        suffix: 'SoccerTV FHD',
      },
      {
        url: 'https://dolive.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-8/playlist.m3u8',
        options: { referer: 'https://live-demo.iamtheme.com/' },
        suffix: 'ThaiM3U',
      },
    ],
  },

  truesportshd2: {
    channelName: 'True Sports 2',
    logo: 'https://iptv36.vercel.app/logo/true_sports_hd2.png',
    groupName: 'Sport',
    sources: [
      {
        url: 'https://cdn1.googlecdn.live/4k/tsp2/playlist.m3u8',
        options: { referer: 'https://soccertv4k.com/' },
        suffix: 'SoccerTV HD',
      },
      {
        url: 'https://cdnsv1.bunnycdncloud.com/andaman888th/truesporthd2/playlist.m3u8',
        options: { referer: 'https://www.andaman888th.com/' },
        suffix: 'Bunny',
      },
      {
        url: 'https://dolive.thaim3u.com/tFQe38qxw4awKkMJD3kcfcekVSrfLnY9/siamsport-9/playlist.m3u8',
        options: { referer: 'https://live-demo.iamtheme.com/' },
        suffix: 'ThaiM3U',
      },
    ],
  },

  ipcam: {
    channelName: 'CAM',
    logo: 'https://iptv36.vercel.app/logo/ipcam.png',
    groupName: 'IP Camera',
    sources: [
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=1&stream=1.sdp?', suffix: '01 Park-164' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=2&stream=1.sdp?', suffix: '02 Park-163' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=3&stream=1.sdp?', suffix: '03 Toilet-163' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=4&stream=1.sdp?', suffix: '04 Door-163' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=5&stream=1.sdp?', suffix: '05 Cat' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=6&stream=1.sdp?', suffix: '06 Kitchen' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=7&stream=1.sdp?', suffix: '07 Floor-2' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=8&stream=1.sdp?', suffix: '08 Electricity' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=9&stream=1.sdp?', suffix: '09 Com-TV' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=10&stream=1.sdp?', suffix: '10 Com-Ying' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=11&stream=1.sdp?', suffix: '11 Bed-1' },
      { url: 'rtsp://admin@192.168.1.200/user=admin&password=&channel=12&stream=1.sdp?', suffix: '12 Bed-2' },
    ],
  },
};

const generateAutoPriorityByFullChannelName = (channelName) => {
  if (channelName.endsWith('FHD')) {
    return 30;
  } else if (channelName.endsWith('HD')) {
    return 20;
  } else {
    return 10;
  }
};

const dynamicallyAddStreamingUrlFromDailyMotion = async () => {
  console.log('Getting dynamic streaming url from DailyMotion...');

  const config = [
    // [channelKey, priority, metaUrl]
    // ['nation', undefined, 'https://www.dailymotion.com/player/metadata/video/x6eoldf'],
  ];

  const suffixMapping = {
    4: 'FHD',
    3: 'HD',
    2: '',
    1: '',
    0: '',
  };

  await Promise.all(
    config.map(async ([channelKey, priority, metaUrl]) => {
      let videoMetaData = {};
      try {
        const response = await axios.get(metaUrl);
        videoMetaData = response.data;
      } catch (error) {
        console.error(`Cannot extract videoMetaData for channel ${channelKey}`);
      }

      let livePlayListUrl = '';
      try {
        livePlayListUrl = videoMetaData.qualities.auto[0].url;
      } catch (error) {
        console.error(`Cannot get live playlist url for channel ${channelKey}`);
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
              streamingInfo[channelKey].sources.unshift({ url, suffix: suffixMapping[i], priority });
              console.log(`  / added ${channelKey}`);
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

const dynamicallyAddStreamingUrlFromByteArkNextData = async () => {
  console.log('Getting dynamic streaming url from ByteArk NextData...');

  const config = [
    // [channelKey, suffix, pageUrl, mode, regExp]
    [
      'amarin',
      'FHD',
      'https://www.amarintv.com/live',
      'regexp',
      // /https:\/\/amarin-ks7jcc\.cdn\.byteark\.com\/live\/playlist.m3u8[^"]+/,
      /https:\/\/amarin-ks7jcc\.cdn\.byteark\.com\/fleetstream\/amarin-live\/index.m3u8[^"]+/,
    ],
  ];

  await Promise.all(
    config.map(async ([channelKey, suffix, pageUrl, mode, regExp]) => {
      let pageHtml = '';
      try {
        const response = await axios.get(pageUrl);
        pageHtml = response.data;
      } catch (error) {
        console.error(`Cannot extract pageHtml from ${channelKey}`);
        console.error(error);
      }

      if (mode === 'regexp') {
        let regExpMatchArray = pageHtml.match(regExp);
        if (regExpMatchArray) {
          let url = regExpMatchArray[0].replace(/\\u0026/g, '&');
          streamingInfo[channelKey].sources.unshift({ url, suffix });
          console.log(`  / added ${channelKey}`);
        } else {
          console.log(`  X regex didn't match ${channelKey}`);
        }
      } else if (mode === 'cheerio') {
        const $ = cheerio.load(pageHtml);
        const nextData = $('#__NEXT_DATA__').html();
        const data = JSON.parse(nextData);
        const streamUrl = get(data, 'data.props.initialState.liveReducer.live.streamUrl');
        console.log(data.props.initialState.liveReducer);
        if (streamUrl) {
          streamingInfo[channelKey].sources.unshift({ streamUrl, suffix });
          console.log(`  / added ${channelKey}`);
        } else {
          console.log(`  X nextdata cannot read ${channelKey}`);
        }
      }
    })
  );
};

const dynamicallyAddStreamingUrlFromPPTV = async () => {
  console.log('Getting dynamic streaming url from PPTV...');

  let pageHtml = '';
  try {
    const response = await axios.get('https://www-live.pptvhd36.com/api/live_player/program/1');
    pageHtml = response.data;
  } catch (error) {
    console.error(`Cannot extract pageHtml from PPTV`);
    console.error(error);
  }

  let regExp = /https:\/\/pptv36-1tsjfj\.cdn\.byteark\.com\/live\/playlist\.m3u8[^']+/;
  let regExpMatchArray = pageHtml.match(regExp);

  if (regExpMatchArray) {
    let url = regExpMatchArray[0];
    streamingInfo.pptv.sources.unshift({ url, suffix: 'FHD' });
    console.log(`  / added PPTV`);
  }
};

const testUrl = async (url, options = {}) => {
  // list of url that we will always not check
  if (
    url.includes('rtsp://') ||
    url.includes('akamaiz.com') ||
    url.includes('googlecdn.live') ||
    url.includes('lnwza007.com') ||
    url.includes('inwstream.com') ||
    url.includes('bunnycdncloud.com')
  ) {
    return true;
  }

  // list of url that always not check on Vercel
  if (
    process.env.VERCEL &&
    (url.includes('ch7.com') || // Geo Restrict
      url.includes('cdn.mcot.net') || // Geo Restrict
      url.includes('pptv36-1tsjfj.cdn.byteark.com') || // Geo Restrictt
      url.includes('thaim3u.com') ||
      url.includes('3bb.co.th') ||
      url.includes('3bbtv.com') ||
      url.includes('prsmedia') ||
      url.includes('dailymotion.com') ||
      url.includes('iptv36.vercel.app/api/') ||
      url.includes('thairath.co.th'))
  ) {
    return true;
  }

  const maximumRetry = 2;
  let attempt = 0;
  let errorMessageArray = [];

  while (attempt < maximumRetry) {
    let response;
    try {
      const headers = {};
      if (options.referer) headers.Referer = options.referer;
      if (options.userAgent) headers['User-Agent'] = options.userAgent;
      response = await axios.get(url, {
        timeout: 5000,
        headers,
      });

      return true;
    } catch (error) {
      let errorMsg = error.code || error.response.status;
      errorMessageArray.push(errorMsg);
      await new Promise((resolve) => setTimeout(resolve, 300));
      attempt += 1;
    }
  }

  return Array.from(new Set(errorMessageArray)).join(' / ');
};

const generateValidSources = async (streamingData) => {
  streamingData.validSources = [];

  await Promise.all(
    streamingData.sources.map(async (source) => {
      let result = await testUrl(source.url, source.options);
      if (result !== true) {
        // broken stream
        console.log(`  X ${streamingData.channelName} - ${result}\n    ${source.url}`);
      } else {
        if (source.priority === undefined) {
          // generate auto priority
          const channelNameComponent = [streamingData.channelName];
          if (source.suffix) {
            channelNameComponent.push(source.suffix);
          }
          const fullChannelName = channelNameComponent.join(' ');
          source.priority = generateAutoPriorityByFullChannelName(fullChannelName);
        }
        streamingData.validSources.push(source);
      }
    })
  );

  // sort by priority
  streamingData.validSources.sort((sourceA, sourceB) => sourceB.priority - sourceA.priority);
};

const getStreamingInfo = async (channelKey, skip = 0) => {
  if (streamingInfo[channelKey] === undefined) {
    console.log(`Cannot retrive streamingInfo for channelKey ${channelKey}`);
  }

  let streamingData = streamingInfo[channelKey] || { channelName: `error ${channelKey}`, sources: [] };

  // check validSources available or not
  if (streamingData.validSources === undefined) {
    await generateValidSources(streamingData);
    // console.log(streamingData.validSources);
  }

  let channelNameComponent = [streamingData.channelName];
  let sources = streamingData.validSources || [];

  let source;
  if (sources.length > 0) {
    source = skip < sources.length ? sources[skip] : sources[0];
  } else {
    channelNameComponent.unshift('[เสีย]');
    source = skip < streamingData.sources.length ? streamingData.sources[skip] : streamingData.sources[0];
  }

  if (source === undefined) {
    console.log({ msg: 'error when getStreamingInfo', channelKey, skip, streamingData });
  }

  if (source.suffix) {
    channelNameComponent.push(source.suffix);
  }

  return {
    channelName: channelNameComponent.join(' '),
    logo: streamingData.logo,
    groupName: streamingData.groupName || 'Thai Free TV',
    tvgId: streamingData.tvgId || '',
    url: source.url,
    options: source.options,
  };
};

module.exports = {
  getStreamingInfo,
  dynamicallyAddStreamingUrlFromDailyMotion,
  dynamicallyAddStreamingUrlFromPPTV,
  dynamicallyAddStreamingUrlFromByteArkNextData,
};
