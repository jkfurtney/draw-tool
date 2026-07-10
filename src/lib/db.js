import { get, set, del } from 'idb-keyval'

const LIST_KEY = 'image-list'

// crypto.randomUUID() only exists in secure contexts (https, or localhost) —
// testing over a plain-http LAN address (e.g. from an iPad/iPhone) needs this fallback.
function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export async function listImages() {
  return (await get(LIST_KEY)) ?? []
}

export async function addImage(file) {
  const id = createId()
  await set(`img:${id}`, file)
  const meta = { id, name: file.name, type: file.type, createdAt: Date.now() }
  const list = await listImages()
  const next = [meta, ...list]
  await set(LIST_KEY, next)
  return meta
}

export async function getImageBlob(id) {
  return get(`img:${id}`)
}

export async function deleteImage(id) {
  await del(`img:${id}`)
  const list = await listImages()
  await set(LIST_KEY, list.filter((meta) => meta.id !== id))
}
