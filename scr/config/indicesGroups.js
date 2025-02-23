const indicesGroups = {
  mainGroup: [39],
  otherGroup: [],
};

for (let i = 1; i <= 500; i += 5) {
  const groupName = `group${i}to${i + 4}`;
  indicesGroups[groupName] = Array.from({ length: 5 }, (_, index) => i - 1 + index);
}

for (let i = 1; i <= 500; i += 10) {
  const groupName = `group${i}to${i + 9}`;
  indicesGroups[groupName] = Array.from({ length: 10 }, (_, index) => i - 1 + index);
}

module.exports = indicesGroups;
