const AWS = require('aws-sdk')
    
const headers = {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            }
 
exports.handler = async (event) => {

  const cognito = new AWS.CognitoIdentityServiceProvider()

   const {
     username,
      password
    } = JSON.parse(event.body)
  
    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    }

try{
    const retornoCognito = await cognito.adminInitiateAuth(params).promise();

     let response = {
            statusCode: 200,
            headers:headers,
            body: JSON.stringify({"token":retornoCognito.AuthenticationResult.IdToken})
        };
    return response;
    }catch(err){
        
        return getRetornoError(err);
    }
       
};

function getRetornoError(err){
    
    let statusCode= 500

       let body={ 
                 "message": "Internal server error"
               }
        if(err.code && err.message){
            statusCode= 400
          body={ 
                    "code":err.code,
                    "message": err.message
               }
        }
        
         let response = {
            statusCode: statusCode,
            headers:headers,
            body: JSON.stringify(body)
        };
        
    return response;
}
