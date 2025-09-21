// src/lib/parse.ts
export function highlight(text: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#39;')

  // 1) 전체를 먼저 escape
  let out = esc(text)

  // 2) URL → 외부 링크 (태그 내부 매칭 방지: '<' 전까지만)
  //    https://... 또는 http://... 이면서 '<'가 나오기 전까지 매칭
  out = out.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
  )

  // 3) 해시태그 → /search?q=tag
  //    앞이 공백/문자열 시작/태그 닫힘(>)인 경우만 링크화 → 이미 만든 <a> 내부 재매칭 완화
  out = out.replace(
    /(^|[\s>])#([A-Za-z0-9_가-힣]+)/g,
    (_m, pre, tag) =>
      `${pre}<a href="/search?q=${encodeURIComponent(tag)}" class="text-blue-500 hover:underline">#${tag}</a>`
  )

  // 4) 멘션 → /user/:username
  out = out.replace(
    /(^|[\s>])@([A-Za-z0-9_]+)/g,
    (_m, pre, user) =>
      `${pre}<a href="/user/${encodeURIComponent(user)}" class="text-blue-500 hover:underline">@${user}</a>`
  )

  return out
}
