export function generateRandomTaskStatusesName() {
  const random = Math.floor(Math.random() * 1000);
  return `RandomTaskStatusesName${random}`;
}

export function generateRandomSlug(base = "SlugName") {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

export function generateRandomTaskAndSlugName(overrides = {}) {
  return {
    taskName: generateRandomTaskStatusesName(),
    slugName: generateRandomSlug(),
    ...overrides,
  };
}
