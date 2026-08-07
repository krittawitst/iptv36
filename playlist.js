const playlistV1 = {
  filename: 'playlist-v1.m3u',
  channelList: [
    // 1-10
    ['blank', 1],
    ['nbt'],
    ['thaipbs'],
    ['true4u', 1],
    ['tv5'],
    ['blank', 6],
    ['tsports'],
    ['ch8', 1],
    ['mcot', 1],
    ['tptv'],

    // 11-20
    ['nbtcentral'],
    ['thairath', 1],
    ['workpoint', 1],
    ['amarin', 1],
    ['ch7', 1],
    ['tnn16'],
    ['blank', 17],
    ['blank', 18],
    ['blank', 19],
    ['tptv', 1],

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
  ['thaipbs'],
  ['tv5'],
  ['tsports'],
  ['tptv'],
  ['tnn16'],
  ['nation'],
  ['nation', 1],
  ['workpoint'],
  ['workpoint', 1],

  // 11-20
  ['true4u'],
  ['gmm25'],
  ['ch8'],
  ['ch8', 1],
  ['mono29'],
  ['mcot'],
  ['mcot', 1],
  ['one'],
  ['thairath'],
  ['thairath', 1],

  // 21-30
  ['ch3'],
  ['amarin'],
  ['amarin', 1],
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
