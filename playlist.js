const playlistV1 = {
  filename: 'playlist-v1.m3u',
  channelList: [
    // 1-10
    ['one', 1],
    ['nbt'],
    ['thaipbs'],
    ['blank', 0],
    ['tv5'],
    ['blank', 1],
    ['tsports'],
    ['ch8', 1],
    ['mcot', 1],
    ['tptv'],

    // 11-20
    ['nbtcentral'],
    ['blank', 1],
    ['workpoint', 1],
    ['blank', 2],
    ['blank', 3],
    ['tnn16'],
    ['blank', 4],
    ['blank', 5],
    ['blank', 6],
    ['blank', 7],

    // 21-30
    ['blank', 8],
    ['nation'],
    ['workpoint'],
    ['true4u'],
    ['gmm25'],
    ['blank', 9],
    ['ch8'],
    ['mono29soundtrack'],
    ['mono29'],
    ['mcot'],

    // 31-36
    ['one'],
    ['thairath'],
    ['ch3'],
    ['amarin'],
    ['ch7'],
    ['pptv'],
  ],
};

const channelListWithBackupChannel = [
  // 1-10
  ['nbt'],
  ['thaipbs'],
  ['tv5'],
  ['tptv'],
  ['nbtcentral'],
  ['nation'],
  ['workpoint'],
  ['workpoint', 1],
  ['true4u'],
  ['gmm25'],

  // 11-20
  ['ch8'],
  ['ch8', 1],
  ['mono29'],
  ['mono29soundtrack'],
  ['mcot'],
  ['mcot', 1],
  ['one'],
  ['thairath'],
  ['ch7'],
  ['pptv'],
];

const playlistV2 = {
  filename: 'playlist-v2.m3u',
  channelList: [...channelListWithBackupChannel],
};

const playlistV3 = {
  filename: 'playlist-v3.m3u',
  channelList: [
    ...channelListWithBackupChannel,

    // ['bein1'],
    // ['bein3'],
    ['monomax1'],
    // ['monomax2'],
  ],
};

const playlistV4 = {
  filename: 'playlist-v4.m3u',
  channelList: [['pptv']],
};

const allPlaylist = [playlistV1, playlistV2, playlistV3];

module.exports = allPlaylist;
