const playlistV1 = {
  filename: 'playlist-v1.m3u',
  channelList: [
    // 1-10
    ['one', 1],
    ['nbt'],
    ['thaipbs'],
    ['thaipbs', 1],
    ['tv5'],
    ['pptv', 1],
    ['tsports'],
    ['ch8', 1],
    ['mcot', 1],
    ['tptv'],

    // 11-20
    ['nbtcentral'],
    ['thairath', 1],
    ['ch3', 1],
    ['amarin', 1],
    ['ch7', 1],
    ['tnn16'],
    ['true4u', 1],
    ['blank'],
    ['blank', 1],
    ['blank', 2],

    // 21-30
    ['blank', 3],
    ['nation'],
    ['workpoint'],
    ['true4u'],
    ['gmm25'],
    ['blank', 4],
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
  ['true4u'],
  ['true4u', 1],
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
  ['thairath', 1],
  ['amarin'],

  // 21-30
  ['ch7'],
  ['ch7', 1],
  ['pptv'],
  ['pptv', 1],
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
