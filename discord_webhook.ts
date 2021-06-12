const webhookUrl = Deno.env.get('DISCORD_WEBHHOK_URL')

export const ComponentTypeActionRow = 1
export const ComponentTypeButton = 2
export const ButtonStylePrimary = 1
export const ButtonStyleSecondary = 2
export const ButtonStyleSuccess = 3
export const ButtonStyleDanger = 4
export const ButtonStyleLink = 5

interface WebhookRequest {
  content?: string
  username?: string
  avatar_url?: string
  tts?: boolean
  embeds?: Embed[]
  components?: Component[]
}

interface Embed {
  title?: string
  description?: string
  url?: string
  timestamp?: number
  color?: number
  footer?: EmbedFooter
  image?: EmbedImage
  thumbnail?: EmbedThumbnail
  video?: EmbedVideo
  provider?: EmbedProvider
  author?: EmbedAuthor
  fields?: EmbedField[]
}
interface EmbedImage {
  url?: string
  proxy_url?: string
  height?: string
  width?: string
}
interface EmbedThumbnail extends EmbedImage {}
interface EmbedFooter {
  text: string
  icon_url?: string
  proxy_icon_url?: string
}
interface EmbedVideo extends EmbedImage {}
interface EmbedProvider {
  name?: string
  url?: string
}
interface EmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
  proxy_icon_url?: string
}
interface EmbedField {
  name: string
  value: string
  inline?: boolean
}

interface Component {
  type: number
  style?: number
  label?: string
  emoji?: Emoji
  custom_id?: string
  url?: string
  disabled?: boolean
  components?: Component[]
}
interface Emoji {
  id: string | null
  name?: string
  animated?: boolean
}

export function Webhook(info: WebhookRequest) {
  if (!webhookUrl) return console.log("Webhook URL未找到, 停止執行")
  fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((resp) => {
      if (resp.ok) return
      console.log(resp.statusText)
      resp.json().then((body) => {
        console.error(body)
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
