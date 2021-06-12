import { ReadConfigFile } from './config.ts'
import * as discord from './discord_webhook.ts'
import Random from 'https://deno.land/x/random@v1.1.2/Random.js'

let mid = Deno.env.get('BILIBILI_MID')
mid = mid ? mid : '539700' // 👍
const bilibiliApiUrl = 'https://api.bilibili.com/x/space/acc/info?mid=' + mid
const config: any = await ReadConfigFile('./config.yaml')
const random = new Random()

fetch(bilibiliApiUrl)
  .then((resp) => resp.json())
  .then((body) => {
    if (body.code != 0) {
      console.error(body.message)
      return
    }
    checkStreaming(body.data, 'bilibili')
  })
  .catch((err) => {
    console.error(err)
  })

interface LiveRoom {
  liveStatus: number
  url: string
  title: string
  cover: string
}

async function checkStreaming(data: any, site: string) {
  const info = data.live_room as LiveRoom
  if (!info.liveStatus) return console.log("未直播");

  const thumbnail = getThumbnail(site)
  const footer = config.discord.hitokoto
    ? await hitokoto()
    : footerList[random.int(0, 10)]
  if (config.discord.enable) {
    discord.Webhook({
      content: config.discord.content,
      avatar_url: data.face ? data.face : undefined,
      embeds: [
        {
          title: info.title,
          description: config.discord.description,
          color: config.discord.color ? config.discord.color : 16744192,
          url: info.url,
          image: {
            url: info.cover,
          },
          thumbnail: {
            url: thumbnail ? thumbnail : undefined,
          },
          footer: {
            text: footer,
          },
        },
      ],
      components: [
        {
          type: discord.ComponentTypeActionRow,
          components: [
            {
              type: discord.ComponentTypeButton,
              label: 'WATCH NOW',
              style: discord.ButtonStyleLink,
              url: info.url,
              emoji: {
                id: config.discord.button.watch.emoji.id,
                name: config.discord.button.watch.emoji.name,
              },
            },
            {
              type: discord.ComponentTypeButton,
              label: 'Source',
              style: discord.ButtonStyleLink,
              url: 'https://github.com/GizmoOAO/yuu-stream-notice-bot',
              emoji: {
                id: '803143081016819713',
              },
            },
          ],
        },
      ],
    })
  }
}

function getThumbnail(site: string): string | void {
  switch (site) {
    case 'bilibili':
      return 'https://i0.hdslb.com/bfs/feed-admin/d11f0d19337292fc64c1f985131bae759219ddfc.png'
    case 'youtube':
      return 'https://cdn.discordapp.com/attachments/820845060651745341/853090005379055646/youtube_social_icon_white.png'
    case 'twitch':
      return 'https://cdn.discordapp.com/attachments/820845060651745341/853090155153981480/TwitchExtrudedWordmarkPurple.png'
    default:
      break
  }
}

function hitokoto(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fetch('https://international.v1.hitokoto.cn/?c=a&charset=utf8')
      .then((resp) => resp.json())
      .then((body) => {
        let text = body.hitokoto
        text += '   ──' + body.from
        resolve(text)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const footerList: string[] = [
  '「人类的悲欢并不相通，我只是觉得他们吵闹。」——鲁迅',
  '我的吼聲之中必定存在意義。',
  '「慚愧、罪惡感、害怕。我們都感受得到。將你的悔悟集結起來，並盡力地消滅它們吧。讓你的敵人感受到你身上的重擔。」——愛達-1',
  '「比自己，比梦想更重要的东西永远都存在着...」——钢之炼金术师',
  '「愿你和重要的人，在来日重逢。」——艾拉',
  '「以盐水作配菜，糖水做主食，就有种奢侈的感觉呢。」——笨蛋测验召唤兽',
  '「猫是可爱的，狼是很帅的。就是说，孤独又可爱又帅。」——我的青春恋爱物语果然有问题',
  '「所谓这个世界的真理，就是由爱所记录下的一切。」——夏彦深见',
  '「献给徐徐多多的祭日。」——村上春树',
  '「宁教我负天下人，休教天下人负我。」——曹操',
]
