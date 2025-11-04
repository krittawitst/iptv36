const playlistV1 = {
  filename: 'playlist-v1.m3u',
  channelList: [
    // 1-10
    ['workpoint', 1],
    ['nbt'],
    ['thaipbs'],
    ['altv'],
    ['tv5'],
    ['pptv', 1],
    ['tsports'],
    ['ch8', 1],
    ['mcot', 1],
    ['tptv'],

    // 11-20
    ['one', 1],
    ['thairath', 1],
    ['thaipbs', 1], // ['ch3', 1],
    ['altv', 1], // ['amarin', 1],
    ['ch7', 1],
    ['tnn16'],
    ['nbt', 1], // ['tnn16', 1],
    ['jkn18'],
    ['jkn18', 1],
    ['true4u', 1],

    // 21-30
    ['nation', 1],
    ['nation'],
    ['workpoint'],
    ['true4u'],
    ['gmm25'],
    ['gmm25', 1],
    ['ch8'],
    ['mono29', 1],
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
  ['nbt', 1],
  ['thaipbs'],
  ['thaipbs', 1],
  ['altv'],
  ['altv', 1],
  ['tv5'],
  ['tv5', 1],
  ['tsports'],
  ['tptv'],

  // 11-20
  ['tptv', 1],
  ['tnn16'],
  ['jkn18'],
  ['jkn18', 1],
  ['nation'],
  ['nation', 1],
  ['workpoint'],
  ['workpoint', 1],
  ['true4u'],
  ['true4u', 1],

  // 21-30
  ['gmm25'],
  ['gmm25', 1],
  ['ch8'],
  ['ch8', 1],
  ['mono29'],
  ['mono29', 1],
  ['mcot'],
  ['mcot', 1],
  ['one'],
  ['one', 1],

  // 31-40
  ['thairath'],
  ['thairath', 1],
  ['ch3'],
  ['amarin'],
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
    // ['monomax1'],
    // ['monomax2'],
  ],
};

const playlistV4 = {
  filename: 'playlist-v4.m3u',
  channelList: [['pptv']],
};

const allPlaylist = [playlistV1, playlistV2, playlistV3];

module.exports = allPlaylist;
