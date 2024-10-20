import { faker } from "@faker-js/faker";

/**
 * @description This function is used to generate a random username for the user. It uses fakerJS to do this, take an adjective along with a name and combines them to create the username
 * @returns {string} It returns the random name generated.
 */
function generateRamdomName(): string {
  const adjective: string = faker.word.adjective({
    length: 5,
    strategy: 'closest'
  })

  const firstName = adjective[0].toUpperCase() + adjective.substring(1)

  const lastName: string = faker.person.firstName()
  return firstName + " " + lastName;
}

export default generateRamdomName;
