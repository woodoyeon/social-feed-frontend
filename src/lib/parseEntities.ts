// src/lib/parseEntities.ts
export type Token =
  | { t: 'text'; v: string }
  | { t: 'url'; v: string }
  | { t: 'tag'; v: string }
  | { t: 'mention'; v: string }

const RE =
  /(https?:\/\/[^\s<]+)|(^|[^\w])#([0-9A-Za-z가-힣_]+)|(^|[^\w])@([A-Za-z0-9_]{1,15})/g

export function parseEntities(input = ''): Token[] {
  const out: Token[] = []
  let i = 0
  let m: RegExpExecArray | null
  RE.lastIndex = 0

  while ((m = RE.exec(input))) {
    if (m[1]) {
      // URL
      const start = m.index
      if (i < start) out.push({ t: 'text', v: input.slice(i, start) })
      out.push({ t: 'url', v: m[1] })
      i = start + m[1].length
      continue
    }
    if (m[3]) {
      // #tag
      const pre = m[2] ?? ''
      const tag = m[3]
      const start = m.index + pre.length
      if (i < start) out.push({ t: 'text', v: input.slice(i, start) })
      out.push({ t: 'tag', v: tag })
      i = start + ('#' + tag).length
      continue
    }
    if (m[5]) {
      // @mention
      const pre = m[4] ?? ''
      const user = m[5]
      const start = m.index + pre.length
      if (i < start) out.push({ t: 'text', v: input.slice(i, start) })
      out.push({ t: 'mention', v: user })
      i = start + ('@' + user).length
      continue
    }
  }
  if (i < input.length) out.push({ t: 'text', v: input.slice(i) })
  return out
}
