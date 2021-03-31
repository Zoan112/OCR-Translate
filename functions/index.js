const functions = require("firebase-functions");
const axios = require('axios');

      

exports.sendToOcr1 = functions.https.onCall( (data, context)=> {

  return  new Promise ((resolve, reject)=>{


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
   
            
  



  

 
