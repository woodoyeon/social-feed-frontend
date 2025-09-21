
import mock from './mock/posts.json'

const delay = (ms:number)=>new Promise(r=>setTimeout(r, ms))

export type Post = {
  id:number; author:{name:string;username:string;profileImage:string;verified?:boolean};
  content:string; images:string[]; createdAt:string;
  likes:number; retweets:number; comments:number;
  isLiked:boolean; isRetweeted:boolean
}

export async function fetchPosts(page=1, limit=10):Promise<Post[]>{
  await delay(600)
  return (mock as Post[]).slice((page-1)*limit, page*limit)
}

export async function toggleLike(id:number){ await delay(200); return {success:true} as const }
export async function toggleRetweet(id:number){ await delay(200); return {success:true} as const }
