function generateAvatarURL(seed: string): string {
  const baseURL = 'https://api.dicebear.com/8.x/open-peeps/svg'

  return `${baseURL}?seed=${seed}&radius=50&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`
}

export default generateAvatarURL;
