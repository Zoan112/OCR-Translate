const functions = require("firebase-functions");
const axios = require('axios');

      

exports.sendToOcr1 = functions.https.onCall( (data, context)=> {

  return new Promise ((resolve, reject)=>{


    let content = JSON.stringify({"requests":[{"image":{"content":data.baseFire},"features":[{"type":"DOCUMENT_TEXT_DETECTION","maxResults":1}]}]});
  
    let config = {
      method: 'post',
      url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBoy7d6rNyetysP_esKu0CrBHizVFQVAHo\n',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : content
    };
    
    axios(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data))
     const w = JSON.stringify(response.data.responses[0].fullTextAnnotation.text)
     // console.log('from W', w)
      resolve (w)
    })
    .catch((error) => {
      console.log(error);
    });

    
  })
       
    })
   
            
  
exports.processTranlate = functions.https.onCall((data, context)=>{
    return new Promise ((resolve, reject)=>{
      console.log(data)

      
      let content = JSON.stringify({"q":data.RSLTFire,"target":"he","model":"base"});
      
      let config = {
        method: 'post',
        url: 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyBoy7d6rNyetysP_esKu0CrBHizVFQVAHo\n',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : content
      };
      
      axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        console.log(JSON.stringify(response.data.data.translations[0].translatedText))
          
        const result = JSON.stringify(response.data.data.translations[0].translatedText)
        resolve (result)
        ;
      })
      .catch((error) => {
        console.log(error);
      });
    
    })

}) 


  

 
