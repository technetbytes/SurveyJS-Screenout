'use strict';

const fs = require('fs');

let rawData = fs.readFileSync('critria.json');
let critria = JSON.parse(rawData);

let rawResponseData = fs.readFileSync('survey_response_1.json');
let surveyRes = JSON.parse(rawResponseData);

let questionNames = []
critria.questions.forEach(element => {
    questionNames.push(element.questionName)
});

let screenOut = null;
let shouldSkip = false;
questionNames.forEach((element,index) => {
    if(!shouldSkip){
        if(surveyRes.hasOwnProperty(element)){
            if(typeof(surveyRes[element]) == "object"){
                if(Array.isArray(surveyRes[element])){
                    let critriaValues = [];
                    critria.questions[index].options.forEach((ele, indx) => {
                        critriaValues.push(ele.value.toString())
                    });
                    //console.log(surveyRes[element],critriaValues);
                    let isSomeElementMatch = critriaValues.some(e => surveyRes[element].includes(e));                   
                    var difference = critriaValues.filter(x => surveyRes[element].indexOf(x) === -1);  
                    //it's SurveryResponse Element contain other values from critria value
                    let findElementLength = critriaValues.length - difference.length
                    //console.log(critriaValues.length , " * ", difference.length);
                    //console.log(surveyRes[element].length," - ", findElementLength)                    
                    if(difference.length < critriaValues.length &&
                        !(surveyRes[element].length > findElementLength)){  
                            screenOut = {}                          
                            screenOut["questionnaireVersion"] = critria.questionnaireVersion
                            screenOut["dateTime"] = new Date().toString()                           
                            screenOut["questionId"] = element;
                            screenOut["questionAnswers"] = surveyRes[element]
                            screenOut["matchingCritria"] = critriaValues
                            screenOut["matched"] = critriaValues.filter(x => difference.indexOf(x) === -1);                            
                            //to avoid extra looping
                            shouldSkip = true;
                        }
                    //console.log(isSomeElementMatch, difference);
                    //console.log(screenOut);                    
                }
            }
            else if (typeof(surveyRes[element]) == "string"){
                //console.log(critria.questions[index].options)
                let critriaValues = [];
                critria.questions[index].options.forEach((ele, indx) => {
                    critriaValues.push(ele.value)
                });
                //console.log(surveyRes[element],"  +  ",critriaValues);
                var difference = critriaValues.filter(x => surveyRes[element].indexOf(x) === -1);  
                //it's SurveryResponse Element contain other values from critria value
                let findElementLength = critriaValues.length - difference.length
                if(difference.length < critriaValues.length &&
                    !(surveyRes[element].length > findElementLength)){  
                        screenOut = {}                          
                        screenOut["questionnaireVersion"] = critria.questionnaireVersion
                        screenOut["dateTime"] = new Date().toString()                           
                        screenOut["questionId"] = element;
                        screenOut["questionAnswers"] = surveyRes[element]
                        screenOut["matchingCritria"] = critriaValues
                        screenOut["matched"] = critriaValues.filter(x => difference.indexOf(x) === -1);                            
                        //to avoid extra looping
                        shouldSkip = true;
                    }
            }        
        }
    }
});
console.log(screenOut);
