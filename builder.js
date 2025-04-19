const fs = require('fs');
const streaming = require('./streaming.js');
const getEpgData = require('./epg.js');
const allPlaylist = require('./playlist.js');

const currentEpochDatetime = new Date().getTime();
const currentDatetimePlus7Hrs = new Date(currentEpochDatetime + 7 * 60 * 60 * 1000);
const currentBkkDatetimeStr = currentDatetimePlus7Hrs.toISOString().slice(0, 16);

const main = async () => {
  // prefetch epg data
  let epgDataPromise;

  if (true /*!process.env.VERCEL*/) {
    epgDataPromise = getEpgData();
  }

  // dynamically add streaming url
  await streaming.dynamicallyAddStreamingUrlFromPPTV();
  await streaming.dynamicallyAddStreamingUrlFromByteArkNextData();

  // remember all active channel key to build epg
  let allActiveChannelKey = [];

  // generate M3U PLAYLIST file
  for (let playlist of allPlaylist) {
    let textStr = `#EXTM3U url-tvg="https://iptv36.vercel.app/epg.xml" refresh="3600"\n#\n`;
    textStr += `#   Homepage: http://iptv36.mooo.com/ (Find another version of IPTV playlists here)\n`;
    textStr += `#   Automatically update at: ${currentBkkDatetimeStr} ICT\n\n`;

    // test all streaming simultaneously
    console.log(`\nChecking streaming url for playlist '${playlist.filename}'...`);

    let uniqueChannelKeyForThisPlaylist = playlist.channelList.reduce((channelList, [channelKey, skip = 0]) => {
      if (!channelList.includes(channelKey)) {
        channelList.push(channelKey);
      }
      return channelList;
    }, []);

    allActiveChannelKey = [...allActiveChannelKey, ...uniqueChannelKeyForThisPlaylist];

    await Promise.all(
      uniqueChannelKeyForThisPlaylist.map(async (channelKey) => {
        await streaming.getStreamingInfo(channelKey);
      })
    );

    // generate playlist file
    for (let i = 0; i < playlist.channelList.length; i++) {
      let [channelKey, skip = 0] = playlist.channelList[i];
      let streamingInfo = await streaming.getStreamingInfo(channelKey, skip);
      let channelName = streamingInfo.channelName;
      let tvgId = streamingInfo.tvgId ? streamingInfo.tvgId : `iptv36.${channelKey}`;
      let channelStr = `#EXTINF:-1 tvg-chno="${i + 1}" tvg-id="${tvgId}" group-title="${
        streamingInfo.groupName
      }" tvg-logo="${streamingInfo.logo}",${channelName}`;

      // add option #EXTVLCOPT
      if (streamingInfo.options) {
        if (streamingInfo.options.referer) {
          channelStr += `\n#EXTVLCOPT:http-referrer=${streamingInfo.options.referer}`;
        }
        if (streamingInfo.options.userAgent) {
          channelStr += `\n#EXTVLCOPT:http-user-agent=${streamingInfo.options.userAgent}`;
        }
      }

      channelStr += `\n${streamingInfo.url}\n\n`;
      textStr = textStr + `${channelStr}`;
    }

    // Added latest update date
    let versionInfo = `#EXTINF:-1 tvg-chno="${playlist.channelList.length + 1}" group-title="Thai Free TV" `;
    versionInfo += `tvg-logo="http://iptv36.mooo.com/logo/info.png",${currentBkkDatetimeStr}\nhttp://iptv36.mooo.com/logo/info.png\n\n`;
    textStr = textStr + `${versionInfo}`;

    // Added website url
    let websiteUrl = `#EXTINF:-1 tvg-chno="${playlist.channelList.length + 2}" group-title="Thai Free TV" `;
    websiteUrl += `tvg-logo="http://iptv36.mooo.com/logo/info.png",https://iptv36.mooo.com/\nhttp://iptv36.mooo.com/logo/info.png\n\n`;
    textStr = textStr + `${websiteUrl}`;

    fs.writeFileSync(`${playlist.filename}`, textStr, 'utf8');

    console.log(`==> Created playlist '${playlist.filename}'`);
  }

  // generate XMLTV EPG file
  if (true /* !process.env.NETLIFY */) {
    allActiveChannelKey = Array.from(new Set(allActiveChannelKey));
    const epgData = await epgDataPromise;

    let xmlHead = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tv SYSTEM "xmltv.dtd">
<tv>
`;
    let xmlTail = '</tv>';

    let availableTvgId = [];

    let xmlProgramBody = '';
    for (let epg of epgData) {
      if (!allActiveChannelKey.includes(epg.channelKey)) {
        continue;
      }

      let tvgId = `iptv36.${epg.channelKey}`;
      xmlProgramBody += `  <programme start="${epg.programStartStr}" `;
      xmlProgramBody += epg.programEndStr ? `stop="${epg.programEndStr}" ` : '';
      xmlProgramBody += `channel="${tvgId}">\n`;
      xmlProgramBody += `    <title><![CDATA[${epg.programTitle}]]></title>\n`;
      if (epg.programSubtitle) {
        xmlProgramBody += `    <sub-title><![CDATA[${epg.programSubtitle}]]></sub-title>\n`;
      }
      if (epg.programDescription) {
        xmlProgramBody += `    <desc><![CDATA[${epg.programDescription}]]></desc>\n`;
      }
      xmlProgramBody += `  </programme>\n`;

      availableTvgId.push(tvgId);
    }

    let xmlChannelBody = '';
    for (let tvgId of new Set(availableTvgId)) {
      xmlChannelBody += `  <channel id="${tvgId}">\n`;
      xmlChannelBody += `    <display-name>${tvgId}</display-name>\n`;
      xmlChannelBody += `  </channel>\n`;
    }

    fs.writeFileSync('epg.xml', xmlHead + xmlChannelBody + xmlProgramBody + xmlTail, 'utf8');
    console.log(`\n==> Created EPG 'epg.xml'`);
  }
};

main();
