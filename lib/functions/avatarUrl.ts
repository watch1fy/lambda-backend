/**
 * 
 * @description This function generated avatar URL for the user based on the seed - that is the random username generated for the user.
 * @param {string} seed This represents the random name generated. It is used as a seed to create the avarat URL.
 * @returns {string} Avatar URL generated using the 'seed' parameter provided.
 * @example const url = generateAvatarURL('Lazy John');
 * console.log(url)
 * // https://api.dicebear.com/8.x/open-peeps/svg?seed=Lazy+John&radius=50&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4
 */

function generateAvatarURL(seed: string): string {
  const baseURL = 'https://api.dicebear.com/8.x/open-peeps/svg'

  return `${baseURL}?seed=${seed}&radius=50&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`
}

export default generateAvatarURL;
