module.exports = function solveSudoku(matrix) {
  let zeros;
  let modified = false;
  do {
    modified = false;
    const resp = findZeros(matrix);
    zeros = resp.zeros;
    matrix = resp.matrix;
    modified = resp.modified;
  } while (modified && zeros.length > 0);
  if (zeros.length === 0) {
    return matrix;
  }
  return goRecursive(zeros, matrix);
};

function findZeros (matrix) {
  let modified = false;
  const zeros = [];
  for (let i = 0; i < 9; i++){
    for (let y = 0; y < 9; y++){
      if (matrix[i][y] === 0) {
        const options = getOptions(matrix, i, y);
        if (options.length === 1) {
          matrix[i][y] = options[0];
          modified = true;
          continue;
        }
        zeros.push([i,y,options]);
      }
    }
  }
  return {zeros, matrix, modified}
}

function getOptions (matrix, row, col) {
  const temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rowDiv = Math.floor(row / 3);
  const colDiv = Math.floor(col / 3);
  for (let i = 0; i < matrix[row].length; i++) {
    const index = temp.indexOf(matrix[row][i]);
    if (index > -1) {
      temp.splice(index, 1);
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    const index = temp.indexOf(matrix[i][col]);
    if (index > -1) {
      temp.splice(index, 1);
    }
  }
  for (let i = 0; i < 3; i++){
    const rowM = rowDiv * 3 + i;
    for (let y = 0; y < 3; y++) {
      const colM = colDiv * 3 + y;
      const index = temp.indexOf(matrix[rowM][colM]);
      if (index > -1) {
        temp.splice(index, 1);
      }
    }
  }
  return temp;
};

function goRecursive(source_zeros, source_matrix) {
  const matrix = JSON.parse(JSON.stringify(source_matrix));
  const zeros = JSON.parse(JSON.stringify(source_zeros));
  const first_zeros = zeros.splice(0,1)[0];
  for (let i = 0; i < first_zeros[2].length; i++) {
    matrix[first_zeros[0]][first_zeros[1]] = first_zeros[2][i];
    if (checkMatrixIsCorrect(matrix, first_zeros[0], first_zeros[1])) {
      if (zeros.length > 0) {
        resp = goRecursive(zeros, matrix);
        if (resp) {
          return resp;
        }
      } else {
        return matrix;
      }
    } else {
      continue;
    }
  }
  return null;
}

function checkMatrixIsCorrect(matrix, row, col) {
  const rowDiv = Math.floor(row / 3);
  const colDiv = Math.floor(col / 3);
  let knownElems = {};
  for (let i = 0; i < matrix[row].length; i++) {
    if (matrix[row][i] === 0) {
      continue
    } 
    if (knownElems[matrix[row][i]] ){
      return false;
    }
    knownElems[matrix[row][i]] = 1;
  }

  knownElems = {};
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][col] === 0) {
      continue
    } 
    if (knownElems[matrix[i][col]] ){
      return false;
    }
    knownElems[matrix[i][col]] = 1;
  }

  knownElems = {};
  for (let i = 0; i < 3; i++){
    const rowM = rowDiv * 3 + i;
    for (let y = 0; y < 3; y++) {
      const colM = colDiv * 3 + y;
      if (matrix[rowM][colM] === 0) {
        continue
      } 
      if (knownElems[matrix[rowM][colM]] ){
        return false;
      }
      knownElems[matrix[rowM][colM]] = 1;
    }
  }
  return true
}
