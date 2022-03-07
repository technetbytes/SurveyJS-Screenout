'use strict';

const fs = require('fs');

let rawData = fs.readFileSync('critria.json');
let critria = JSON.parse(rawData);
console.log(critria.questions);

let rawResponseData = fs.readFileSync('survey_response_1.json');
let surveyRes = JSON.parse(rawResponseData);

