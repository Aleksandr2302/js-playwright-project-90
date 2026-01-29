export const loginData = {
  username: "username",
  password: "password",
};
export const statusesArr = [
  "Published",
  "To Publish",
  "To Be Fixed",
  "To Review",
  "Draft",
];
export const labelsArr = ["critical", "task", "enhancement", "feature", "bug"];

export const taskIdStatus = {
  1: "Draft",
  2: "To Review",
  3: "To Be Fixed",
  4: "To Publish",
  5: "Published",
};

export function generateRandomStatusOrLabelfromArr(arr) {
  const random = Math.floor(Math.random() * arr.length);
  return arr[random];
}

export function generateRandomStatusId(taskIdStatus, currentStatusName) {
  const ids = Object.keys(taskIdStatus).filter(
    (id) => taskIdStatus[id] !== currentStatusName,
  );

  const randomIndex = Math.floor(Math.random() * ids.length);
  return ids[randomIndex];
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

export function generateRandomTitle(base = "tileName") {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

export function generateRandomContent(base = "contentName") {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}
