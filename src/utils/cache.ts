export function saveCache(key:string,data:any){try{localStorage.setItem(key,JSON.stringify(data))}catch{}}
export function loadCache<T=any>(key:string):T|null{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:null}catch{return null}}
