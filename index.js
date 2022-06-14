const fs = require('fs')
const handle = require('./handle.js');

const readFile = (name) => new Promise((resolve, reject) => {
  fs.readFile(`${__dirname}/${name}.srt`, (err, data) =>{
    if (err) reject(err);
    resolve(data);
  })
});

const outputFile = (name,data) => {
  fs.writeFile(`${__dirname}/${name}.srt`, data, err => {
    if (err) throw err;
  })
}

const merge = (data, srtLength) =>{  
  var resultSrt = [];
  for (let i = 0; i < data.length; i++) {
    resultSrt = resultSrt.concat(handle.main(data[i], resultSrt.length, srtLength * i));
  }
  return handle.parseToSrt(resultSrt);
}

const Main = async() =>{
  try {
    var data = [];
    for (let i = 1; i <= 4; i++) {
        const temp = await readFile(i + '.mp4');
        data.push(temp);
    };
    const result = merge(data, 600);
    outputFile('output',result);
  } catch (err) {
    throw err;
  }
}


Main();

