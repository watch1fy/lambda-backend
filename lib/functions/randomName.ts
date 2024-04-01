import { faker } from "@faker-js/faker";

function generateRamdomName(): string {
  const adjective: string = faker.word.adjective({
    length: 5,
    strategy: 'closest'
  })

  const firstName = adjective[0].toUpperCase() + adjective.substring(1)

  const lastName: string = faker.person.lastName()
  return firstName + lastName;
}

export default generateRamdomName;
