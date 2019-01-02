//Author: Dean O'R
//Code snippets taken from : https://aws.amazon.com/blogs/machine-learning/greetings-visitor-engage-your-web-users-with-amazon-lex/


// Initialize the Amazon Cognito credentials provider
//you can find this region and identity pool in the AWS Cognito Idenity pool which you set up -> Example Code
AWS.config.region = ''; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '', //Identity Pool ID 
});

var userLangugae; //Global variable 

function Translate(text,source,dest,value){
    //Function which is used to convert the inputted text to the language which is needed
    var result;
    userLangugae = source;
    var params = {
        SourceLanguageCode: userLangugae, /* required */
        TargetLanguageCode: dest, /* required */
        Text: text /* required */
    };
    var translate = new AWS.Translate({apiVersion: '2017-07-01'}); //Creates the Translate Client       
    translate.translateText(params, function (err, data) {
      if (err){
       console.log(err, err.stack)
      }// an error occurred
      else {
          console.log(data);
          result= data.TranslatedText;// successful response
          console.log(result);
          
          if (value == 'cust'){// this if statement is used to identify if the input was from Lex or from the Customer
              lexBot(result);
          }
          else{
              showResponse(result);
          }
        }
    });
    
}
                            
    
var sessionAttributes = {};
var lexruntime = new AWS.LexRuntime();// these variables are used for the Lex Session 
var lexUserId = 'chatbot-demo' + Date.now();

function showError(daText) {
			var conversationDiv = document.getElementById('conversation');
			var errorPara = document.createElement("P");
			errorPara.className = 'lexError';
			errorPara.appendChild(document.createTextNode(daText));
			conversationDiv.appendChild(errorPara);
			conversationDiv.scrollTop = conversationDiv.scrollHeight;
		}

function lexBot(value){
    // This is the function which is used to directly interact with the Lex Bot. 
    //The response is in English which is then Translated 
    var params = {
					botAlias: '$LATEST',
					botName: '',//In order to use your Lex bot change this Bot name and Alias if needed 
					inputText: value,
					userId: lexUserId,
					sessionAttributes: sessionAttributes
				};
    
    lexruntime.postText(params, function(err, data) {
					if (err) {
						console.log(err, err.stack);
						showError('Error:  ' + err.message + ' (see console for details)')
					}
					if (data) {
						// capture the sessionAttributes for the next cycle
						sessionAttributes = data.sessionAttributes;
                        var value = data.message;
						// show response and/or error/dialog status 
						Translate(value,'en',userLangugae,'lex');
					}
				});
			}