export function generateUser(overrides = {}) {
  return {
    email: generateRandomEmail(),
    firstName: generateRandomName(),
    lastName: generateRandomLastName(),
    ...overrides,
  };
}

export function generateRandomEmail() {
  const random = Math.floor(Math.random() * 1000);
  return `example${random}@gmail.com`;
}

export function generateRandomName(base = "UserName") {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

export function generateRandomLastName(base = "UserLastName") {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}
