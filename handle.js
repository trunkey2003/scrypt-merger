var { default: srtParser2 } = require("srt-parser-2")
var parser = new srtParser2();


class HandleData {
    main(data, indexStartsAt, timeStartsAt) {
        const srt = data.toString('utf8');
        const parsedSrt = parser.fromSrt(srt);

        parsedSrt.forEach((sub) => {
            sub.startTime = this.handleConvertTimeStringToFloat(sub.startTime);
            sub.startTime += timeStartsAt;
            sub.startTime = this.handleConvertFloatToTimeString(sub.startTime);

            sub.endTime = this.handleConvertTimeStringToFloat(sub.endTime);
            sub.endTime += timeStartsAt;
            sub.endTime = this.handleConvertFloatToTimeString(sub.endTime);

            sub.id = parseInt(sub.id) + indexStartsAt;
            sub.id = JSON.stringify(sub.id);
        });

        console.log(parsedSrt);
        return parsedSrt;
    }

    handleConvertTimeStringToFloat(timeString) {
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

    handleConvertFloatToTimeString(secondFloat) {
        var hours = Math.floor(secondFloat / 3600);
        var minutes = Math.floor((secondFloat - (hours * 3600)) / 60);
        var seconds = (secondFloat - (hours * 3600) - (minutes * 60)) < 10 ? ((secondFloat - (hours * 3600) - (minutes * 60)) < 1.0 ? (secondFloat - (hours * 3600) - (minutes * 60)).toPrecision(3) : (secondFloat - (hours * 3600) - (minutes * 60)).toPrecision(4)) : (secondFloat - (hours * 3600) - (minutes * 60)).toPrecision(5);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return (hours + ':' + minutes + ':' + seconds).replace('.', ',');
    }

    parseFromSrt(srt) {
        return parser.fromSrt(srt);
    }

    parseToSrt(parsedSrt) {
        return parser.toSrt(parsedSrt);
    }
};

module.exports = new HandleData;