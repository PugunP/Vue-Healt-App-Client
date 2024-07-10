///Production///

/***** Deploy_KMITL_SERVER *****/ 
// const baseURL = `http://161.246.127.114/api/v1`

/***** Deploy_railway.app_SERVERS *****/
// const baseURL = `https://ppsp-projectbackend-production-5099.up.railway.app/api/v1` 



///Development///
const baseURL = `http://localhost:3000/api/v1` 

//USERS_APIGATEWAYS//
const SIGNIN = `${baseURL}/users/login`;
const SIGNUP = `${baseURL}/users/register`
const GETME = `${baseURL}/users/me` // USE Header : Authorization `Bearer ` + accessToken
const UPDATEME = `${baseURL}/users/update` // USE Header : Authorization `Bearer ` + accessToken
const DELETEUSERS = `${baseURL}/users` // USE Header : Authorization `Bearer ` + accessToken and /users/:_id **ADMIN_API**
const GETALLUSERS = `${baseURL}/users/getallusers`
const SEARCHUSERS = `${baseURL}/users/?Search=`

//HEALTHS_APIGATEWAYS//
const GETMEHEALTH = `${baseURL}/healths/me` //USER Header : Authorization `Bearer ` + accessToken
const ADDMEHEALTH = `${baseURL}/healths/addme` //USER Header : Authorization `Bearer ` + accessToken

//QUEUE_APIGATEWAYS//
const GETMEQUEUES = `${baseURL}/queues/me` 
const ADDQUEUES = `${baseURL}/queues/add`        // USE Header : Authorization `Bearer ` + accessToken **ADMIN_API**
const GETALLQUEUES = `${baseURL}/queues/get-all` // USE Header : Authorization `Bearer ` + accessToken **ADMIN_API**
const UPDATEQUEUES = `${baseURL}/queues/update`  // USE Header : Authorization `Bearer ` + accessToken and /update/:queueId **ADMIN_API**
const DELETEQUEUES = `${baseURL}/queues/`  // USE Header : Authorization `Bearer ` + accessToken and /update/:queueId **ADMIN_API**


export {
    //BASE//
    baseURL,
    //USERS_APIGATEWAYS//
    SIGNIN,
    SIGNUP,
    GETME,
    UPDATEME,
    GETALLUSERS,
    SEARCHUSERS,
    DELETEUSERS,
    //HEALTHS_APIGATEWAYS//
    GETMEHEALTH,
    ADDMEHEALTH,
    //QUEUES_APIGATEWAYS//
    GETMEQUEUES,
    ADDQUEUES,
    GETALLQUEUES,
    UPDATEQUEUES,
    DELETEQUEUES

}