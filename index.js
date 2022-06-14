var { default: srtParser2 } = require("srt-parser-2")
var parser = new srtParser2();

const handleData = (data, indexStartsAt, timeStartsAt) => {
  const srt = data.toString('utf8');
  const parsedSrt = parser.fromSrt(srt);

  parsedSrt.forEach((sub) => {
    sub.startTime = handleConvertTimeStringToFloat(sub.startTime);
    sub.startTime += timeStartsAt;
    sub.startTime = handleConvertFloatToTimeString(sub.startTime);

    sub.endTime = handleConvertTimeStringToFloat(sub.endTime);
    sub.endTime += timeStartsAt;
    sub.endTime = handleConvertFloatToTimeString(sub.endTime);

    sub.id = parseInt(sub.id) + indexStartsAt;
    sub.id = JSON.stringify(sub.id);
  });

  console.log(parsedSrt);
  return parsedSrt;
}

const handleConvertTimeStringToFloat = (timeString) => {
  const timeArray = timeString.split(':');
  var res = 0;
  timeArray.forEach((timeE, index) => {
    timeE = timeE.replace(',', '.');
    if (index == 0) {
      res += parseFloat(timeE) * 60 * 60;
    };
    if (index == 1) {
      res += parseFloat(timeE) * 60;
    };
    if (index == 2) {
      res += parseFloat(timeE) * 1;
    }
  });
  return res;
}

const handleConvertFloatToTimeString = function (secondFloat) {
  var hours = Math.floor(secondFloat / 3600);
  var minutes = Math.floor((secondFloat - (hours * 3600)) / 60);
  var seconds = (secondFloat - (hours * 3600) - (minutes * 60)) < 10 ? ((secondFloat - (hours * 3600) - (minutes * 60)) < 1.0 ? (secondFloat - (hours * 3600) - (minutes * 60)).toPrecision(3) : (secondFloat - (hours * 3600) - (minutes * 60)).toPrecision(4)) : (secondFloat - (hours * 3600) - (minutes * 60)).toPrecision(5);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }

  return (hours + ':' + minutes + ':' + seconds).replace('.', ',');
}

const fs = require('fs')

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
    // console.log(data[i]);
    resultSrt = resultSrt.concat(handleData(data[i], resultSrt.length, srtLength * i));
  }
  return parser.toSrt(resultSrt);
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

