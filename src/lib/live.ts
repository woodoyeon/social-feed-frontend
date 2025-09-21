// src/lib/live.ts
import { usePosts } from '@/store/usePosts'

export class LivePolling {
  private timer?: ReturnType<typeof setInterval>
  constructor(private intervalMs = 5000) {}
  start() { this.tick(); this.timer = setInterval(() => this.tick(), this.intervalMs) }
  stop() { if (this.timer) clearInterval(this.timer) }
  private async tick() {
    try {
      const latestId = usePosts.getState().items[0]?.id ?? 0
      const res = await fetch(`/api/feed?after=${latestId}`, { cache: 'no-store' })
      if (!res.ok) return
      const posts = await res.json() as any[]
      posts.forEach(p => usePosts.getState().pushLive(p))
    } catch {}
  }
}

export class MockSocket {
  private timer?: ReturnType<typeof setInterval>
  private seq = 100000
  start(periodMs = 3000) {
    this.timer = setInterval(() => {
      const now = Date.now()
      usePosts.getState().pushLive({
        id: this.seq++,
        content: `실시간 새 글이 도착했습니다 #live #${Math.floor(Math.random()*100)}`,
        author: { name: 'Live', username: 'live' },
        createdAt: now,
        images: Math.random() > 0.7 ? [`https://picsum.photos/seed/${now}/600/400`] : [],
      } as any)
    }, periodMs)
  }
  stop() { if (this.timer) clearInterval(this.timer) }
}
