import fs from "fs";
import { exec, execSync } from "child_process";
import http from "http";
import https from "https";
const yellow = "\u001b[1;33m";
const green = "\u001b[1;32m";
const red = "\u001b[1;31m";
const white = "\u001b[1;37m";
const blue = "\u001b[1;34m";
const cyan = "\u001b[1;36m"
const magenta = "\u001b[1;35m"
const orange = "\u001b[1;38;5;208m"
const underline = "\u001b[4m";
const reset = "\u001b[0m";
const info = `${blue}[+]${white} `;
const error = `${red}[!]${white} `;
const ask = `${yellow}[?]${white} `;
const RequiredDependencies = ["inquirer", "axios", "ora", "password-prompt", "crypto"];
const NodeModules = "./node_modules/";
const api = "https://flikers.net/android/android_get_react.php";
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
const deleteCookieHelp = `
${green}**COMMANDS**
${info + yellow}B - ${green}(BACK)
${info + yellow}A - ${green}(DELETE ALL COOKIE)
`;
const urlHelp = `
${green}**COMMANDS**
${info + yellow}B - ${green}(BACK)

${green}**NOTE**
${info}DON'T USE THE FACEBOOK APPLICATION TO COPY THE LINK OF THE POST, USE FACEBOOK LITE OR CHROME INSTEAD.
`;
String.prototype.toTitle = function(){
  const titled = this.slice(0, 1).toUpperCase();
  return titled + this.slice(1, undefined);
}
function setClear(){
  if (process.platform === "win32"){
    execSync("cls", { stdio: "inherit" });
    return;
  }
  execSync("clear", { stdio: "inherit" });
}
function getTimeStamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${yellow}[${hours}:${minutes}:${seconds}]${reset} `;
}
class prompts {
  static getMainCommand = {
    type: "input",
    name: "cmd",
    prefix: "",
    message: ask + "FacebookLikers~$",
    validate: (cmd) => {
      if (cmd.trim() === ""){
        return error + `Invalid Option.`;
      }
      if (!/^\d+$/.test(cmd)){
        return error + `Invalid Option. Please Enter Only Numbers`;
      }
      cmd = parseInt(cmd);
      if (cmd <= 0 || cmd >= 6){
        return error + `Invalid Option. Out of Range`;
      }
      return true;
    }
  }
  static getPostURL = {
    type: "input",
    name: "url",
    prefix: "",
    message: ask + "Facebook Post URL (press h for help)~$",
    validate: (url) => {
      if (url.toLowerCase() === "h"){
        return urlHelp;
      }
      if (url.toLowerCase() === "b"){
        return true;
      }
      if (url.trim() === ""){
        return error + "Invalid URL";
      }
      if (!url.startsWith("https://www.facebook.com/") && !url.startsWith("http://www.facebook.com/")){
        return error + "Invalid URL";
      }
      return true;
    }
  }
  static getReaction = {
    type: "list",
    name: "react_type",
    prefix: "",
    message: ask + `Selected Reaction~$`,
    choices: [cyan + "LIKE", magenta + "LOVE", yellow + "HAHA", orange + "WOW", blue + "SAD", red + "ANGRY", green + "CARE"]
  }
  static getCookieCommand = {
    type: "input",
    name: "cookieCommand",
    prefix: "",
    message: ask + `CookieManagement~$`,
    validate: (cookieCommand) => {
      if (cookieCommand.trim() === ""){
        return error + `Invalid Option.`;
      }
      if (!/^\d+$/.test(cookieCommand)){
        return error + `Invalid Option. Please Enter Only Numbers`;
      }
      cookieCommand = parseInt(cookieCommand);
      if (cookieCommand <= 0 || cookieCommand >= 4){
        return error + `Invalid Option. Out of Range`;
      }
      return true;
    }
  }
  static addCookie = {
    type: "input",
    name: "email",
    prefix: "",
    message: ask + `Facebook (Email/ID/Phone)~$`,
    validate: (email) => {
      if (email.trim() === ""){
        return error + `Really Nigga`;
      }
      if (email.toLowerCase() === "b"){
        return true;
      }
      return true;
    }
  }
  static deleteCookie = {
    type: "input",
    name: "cookieIndex",
    prefix: "",
    message: ask + `Delete Cookie (press h for help)~$`,
    validate: (cookieIndex) => {
      if (cookieIndex.toLowerCase() === "h"){
        return deleteCookieHelp;
      }
      if (cookieIndex.trim() === ""){
        return error + `Invalid Option`;
      }
      if (cookieIndex.toLowerCase() === "b"){
        return true;
      }
      if (cookieIndex.toLowerCase() === "a"){
        return true;
      }
      if (!/^\d+$/.test(cookieIndex)){
        return error + `Invalid Option. Please Enter Only Numbers`;
      }
      cookieIndex = parseInt(cookieIndex);
      if (cookieIndex < 1 || cookieIndex > cookiesJSONParsed["Cookies"].length){
        return error + `Invalid Option. Out of Range`;
      }
      return true;
    }
  }
  static askBack = {
    type: "input",
    name: "back",
    prefix: "",
    message: ask + `Do You Want To Go Back? (y/n, default: y)~$`,
  }
  static askToContinue = {
    type: "input",
    name: "_",
    prefix: "",
    message: ask + `Press Enter To Continue~$`
  }
}
async function InstallDependencies(requiredDependencies){
  if (!fs.existsSync(NodeModules)) {
    execSync(`mkdir -p ${NodeModules}`);
  }
  for (const requiredDependency of requiredDependencies) {
    if (!fs.existsSync(NodeModules.concat(requiredDependency))) {
      console.log(`${info}Installing ${yellow}${underline}${requiredDependency.toTitle()}${reset}${white} Dependency`);
      try {
        execSync(`npm i --save ${requiredDependency}`, { stdio: "inherit" });
        console.log(`${info}${yellow}${underline}${requiredDependency.toTitle()}${reset}${white} Installed Successfully`);
      }
      catch ($) {
        console.log(info + "Failed to install " + requiredDependency);
        console.log(error + $.message);
        process.exit();
      }
    }
  }
  console.log(getTimeStamp() + info + `All Required Dependencies Installed Successfully`);
}
function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function animate(text, ms = 4){
  text = text.toString();
  for (const char of text){
    await delay(ms);
    process["stdout"]["write"](char);
  }
  console.log();
}
async function exit(){
  await animate(getTimeStamp() + info + `IF YOU ENCOUNTER ANY BUGS OR ISSUES, PLEASE FEEDBACK YOUR MESSAGE IS VALUABLE TO US :)`, 25);
  await animate(getTimeStamp() + info + `THANKS FOR USING`, 25);
  process.exit();
}
await InstallDependencies(RequiredDependencies);
const { default: inquirer } = await import("inquirer");
const { default: ora } = await import("ora");
const { default: axios } = await import("axios");
const { default: getPassword } = await import("password-prompt");
const { default: crypto } = await import("crypto");
// AUTO UPDATE REPO
/*try{
  console.log(getTimeStamp() + info + `Checking for updates...`);
  const response = execSync("git pull").toString();
  if (response.includes("Already up to date.")){
    console.log(getTimeStamp() + info + `No updates found.`);
  }
  else{
    const commitMessage = execSync("git log -1 --pretty=%B").toString();
    console.log(getTimeStamp() + info + "Update successful. Please run the script again using: " + yellow + "node index.js");
    console.log(getTimeStamp() + info + `Update Message : ${green + commitMessage}`)
    process.exit();
  }
}
catch($){
  console.log(getTimeStamp() + error + "Update failed. Please ensure that git is installed.");
  console.log(getTimeStamp() + error + $.message);
  process.exit();
}
*/
const getSystemHash = () => {
  try{
    const id = execSync("getprop ro.system.build.id").toString();
    const date = execSync("getprop ro.system.build.date").toString();
    const systeminf = id.toString().trim() + date.toString().trim();
    const hash = crypto.createHash("sha256").update(systeminf).digest("base64");
    return hash;
  }
  catch($){
    return {
      errorMsg: "An error occurred while fetching system information, but the application remains functional."
    };
  }
}

let currentUTCDate = new Date();
let offset = 8;
let currentDate = new Date(currentUTCDate.getTime() + offset * 3600 * 1000);
let expirationDate = new Date("2025-05-19");
const millisecondsPerDay = 1000 * 60 * 60 * 24;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let daysLeft;
const hash = getSystemHash();
const adminKey = ""; // Admin Build ID + Build Date (Base64)
if (!hash.errorMsg){
  if (adminKey === hash){
    expirationDate = new Date("2030-05-19");
  }
}
else{
  console.log(getTimeStamp() + error + hash.errorMsg);
}
if (currentDate >= expirationDate) {
  console.log(getTimeStamp() + error + "The access period has expired.");
  process.exit();
}
console.log(getTimeStamp() + info + `Free until ${yellow + underline + monthNames[expirationDate.getMonth()]} ${expirationDate.getDate()} ${expirationDate.getFullYear() + reset}`);
daysLeft = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / millisecondsPerDay);
const version = "v2.3"
const banner = `${green} ___  ___  _    _  _  ${yellow}Developer: ${blue}Kairu ${red + underline}(#${version})${reset}${green}
| __>| . >| |  <_>| |__ ___  _ _  ___  
| _> | . \\| |_ | || / // ._>| '_><_-< 
|_|  |___/|___||_||_\\_\\___. |_|  /__/ ${cyan}(Days Left: ${daysLeft})`;

try{
  execSync("pip3 -V", { stdio: "ignore" });
}
catch($){
  console.log(info + `Installing Python`);
  execSync("pkg install python3 -y", { stdio: "inherit" });
  execSync("pkg install python-pip -y", { stdio: "inherit" });
}
try{
  execSync("pip3 show requests", { stdio: "ignore" })
  execSync("pip3 show bs4", { stdio: "ignore" })
  execSync("pip3 show flask", { stdio: "ignore" })
}
catch($){
  try{
    console.log(info + `Installing Python ${yellow + underline}Requests${reset + white} Module`);
    execSync("pip3 install requests", { stdio: "inherit" })
    console.log(info + `Installing Python ${yellow + underline}Bs4${reset + white} Module`);
    execSync("pip3 install bs4",  { stdio: "inherit" });
    console.log(info + `Installing Python ${yellow + underline}Flask${reset + white} Module`);
    execSync("pip3 install flask", { stdio: "inherit" });
  }
  catch($){
    console.log(getTimeStamp() + error + $);
    process.exit();
  }
}
console.log(getTimeStamp() + info + `Starting API`);
// if yung ibang users nakaka encounter ng "No module named 'flask'" uncomment mo yung nasa baba
//await delay(5000);
const port = Math.floor(Math.random() * (65535 - 1025 + 1)) + 1025;
exec(`python3 api.py ${port}`, (err, _1, _2) => {
  if (err){
    console.log(getTimeStamp() + error + `Unable to start the API`);
    console.log(getTimeStamp() + error + `Error Details: ` + err.message);
    process.exit();
  }
})
console.log(getTimeStamp() + info + `API Started Successfully`);
await delay(5000);
const { getCookie } = await import("./cookieGetter.js");
let loading = ora({
  spinner: "point",
  prefixText: getTimeStamp() + info + "Authenticating",
  interval: 80,
  color: "green",
});
const cookieJSONLocate = "./cookies.json";
let cookiesJSON;
let cookiesJSONParsed;
async function Goback(){
  const { back } = await inquirer.prompt(prompts.askBack);
  if (back.toLowerCase() === "n"){
    await exit();
  }
  main();
}
async function Feedback(){
  setClear();
  const { feedbackType } = await inquirer.prompt({
    name: "feedbackType",
    type: "list",
    prefix: "",
    message: ask + "Where would you like to leave your feedback?",
    choices: [cyan + "Facebook", blue + "Telegram", red + "Back"]
  });
  if (feedbackType.includes("Facebook")){
    try{
      execSync("termux-open http://www.facebook.com/KairuxDev");
    }
    catch($){
      execSync("xdg-open http://www.facebook.com/KairuxDev");
    }
  }
  else if (feedbackType.includes("Telegram")){
    try{
      execSync("termux-open http://t.me/KairuDev");
    }
    catch($){
      execSync("xdg-open http://t.me/KairuDev");
    }
  }
  main();
}
function UpdateCookies(){
  try{
    cookiesJSON = fs.readFileSync(cookieJSONLocate, "utf8");
    cookiesJSONParsed = JSON.parse(cookiesJSON);
  }
  catch($){
    console.log(getTimeStamp() + error + $.message);
    process.exit();
  }
}
UpdateCookies();
async function Continue(){
  await inquirer.prompt(prompts.askToContinue);
}
async function ShowCookie(){
  setClear();
  console.log(getTimeStamp() + info + `${yellow}NOTE: ${green}MORE COOKIES MORE LIKES :D`);
  console.log(`${cyan}---------------------${green}Cookies${cyan}---------------------`)
  if (cookiesJSONParsed["Cookies"].length === 0){
    console.log(getTimeStamp() + error + `No Cookies Found.`);
    console.log(getTimeStamp() + info + `Please add a cookie first so you can use FBLikers.`);
    console.log(`${cyan}---------------------${green}Cookies${cyan}---------------------`)
    console.log();
    await Continue();
    await CookieManagement();
    return;
  }
  for (let i = 0; i < cookiesJSONParsed["Cookies"].length; i++){
    console.log(getTimeStamp() + info + `${yellow}Email/ID/Number#${i+1} ~ ${green + cookiesJSONParsed["Emails"][i].slice(0, 10)}...`);
    console.log(getTimeStamp() + info + `${green}DATR${yellow}(${i+1}) ~ ${green}${cookiesJSONParsed["Cookies"][i].length >= 20 ? cookiesJSONParsed["Cookies"][i].slice(0, 20) : cookiesJSONParsed["Cookies"][i]}...`);
  }
  console.log(`${cyan}---------------------${green}Cookies${cyan}---------------------`)
  console.log();
  await Continue();
  main();
}
async function CookieManagement(){
  setClear();
  await animate(banner, 2);
  await animate(`
${yellow}(1) ~ ${blue}Add Cookie Datr ~ ${green}(Add Facebook Cookie)
${yellow}(2) ~ ${blue}Delete Cookie Datr ~ ${green}(Delete Facebook Cookie)
${yellow}(3) ~ ${blue}Back ~ ${green}(Previous Menu)
`, 2)
  let { cookieCommand } = await inquirer.prompt(prompts.getCookieCommand);
  cookieCommand = parseInt(cookieCommand);
  if (cookieCommand === 1){
    InsertCookie();
  }
  else if (cookieCommand === 2){
    DeleteCookie();
  }
  else if (cookieCommand === 3){
    main();
  }
}
async function InsertCookie(){
  try{
    setClear();
    console.log(getTimeStamp() + info + `PLEASE WAIT FOR THE COUNTDOWN | ${green}5s`);
    await delay(5000);
    setClear();
    await animate(banner);
    console.log();
    await animate(getTimeStamp() + error + `${yellow}WARNING: ${red}PLEASE DO NOT USE YOUR PERSONAL ACCOUNT IF YOU WANT TO AVOID SUSPENDING YOUR ACCOUNT. INSTEAD, USE A NEW ACCOUNT. THE AUTHOR IS NOT RESPONSIBLE FOR ACCOUNT SUSPENSIONS.`, 10)
    console.log();
    const { email } = await inquirer.prompt(prompts.addCookie);
    const password = await getPassword(ask + "Facebook Password~$ ", { "method": "mask" });
    loading.start();
    const response = await getCookie(email, password, port);
    loading.stop();
    if (response.includes("Invalid") || response.includes("Error")){
      console.log(getTimeStamp() + error + response);
      await Continue();
      await CookieManagement();
      return;
    }
    console.log(getTimeStamp() + info + `Saving Cookie Datr in ${yellow}cookies.json...`);
    if (fs.existsSync(cookieJSONLocate)){
      cookiesJSONParsed["Cookies"].push(response);
      cookiesJSONParsed["Emails"].push(email);
      fs.writeFileSync(cookieJSONLocate, JSON.stringify(cookiesJSONParsed), "utf8");
      UpdateCookies();
      console.log(getTimeStamp() + info + `New Cookie Added | Total Cookiez : ${cookiesJSONParsed["Cookies"].length}`);
      await Goback();
    }
    else{
      console.log(getTimeStamp() + error + `${yellow}cookies.json ${white}Not Found`);
      console.log(getTimeStamp() + info + `Y u do this`);
      process.exit();
    }
  }
  catch($){
    console.log(getTimeStamp() + error + `InsertionCookie Function Error`);
    console.log(getTimeStamp() + error + $.message);
    process.exit();
  }
}
async function DeleteCookie(){
  setClear();
  await animate(banner);
  console.log();
  console.log(`${cyan}---------------------${green}Cookies${cyan}---------------------`)
  if (cookiesJSONParsed["Cookies"].length === 0){
    console.log(getTimeStamp() + error + `No Cookies Found.`);
    console.log(getTimeStamp() + info + `Please add a cookie first so you can use FBLikers.`);
    console.log(`${cyan}---------------------${green}Cookies${cyan}---------------------`)
    console.log();
    await Continue();
    await CookieManagement();
    return;
  }
  for (let i = 0; i < cookiesJSONParsed["Cookies"].length; i++){
    console.log(getTimeStamp() + info + `${yellow}Email/ID/Number#${i+1} ~ ${green + cookiesJSONParsed["Emails"][i].slice(0, 10)}...`);
    console.log(getTimeStamp() + info + `${green}DATR${yellow}(${i+1}) ~ ${green}${cookiesJSONParsed["Cookies"][i].length >= 20 ? cookiesJSONParsed["Cookies"][i].slice(0, 20) : cookiesJSONParsed["Cookies"][i]}...`);
  }
  console.log(`${cyan}---------------------${green}Cookies${cyan}---------------------`)
  console.log();
  let { cookieIndex } = await inquirer.prompt(prompts.deleteCookie);
  if (cookieIndex.toLowerCase() === "a"){
    try{
      cookiesJSONParsed["Emails"] = [];
      cookiesJSONParsed["Cookies"] = [];
      fs.writeFileSync(cookieJSONLocate, JSON.stringify(cookiesJSONParsed), "utf8");
      UpdateCookies();
      console.log(getTimeStamp() + info + `All cookies removed successfully.`);
      await Goback();
    }
    catch($){
      console.log(getTimeStamp() + error + $.message);
      process.exit();
    }
  }
  else if (cookieIndex.toLowerCase() === "b"){
    await CookieManagement();
  }
  else{
    try{
      cookieIndex = parseInt(cookieIndex);
      cookiesJSONParsed["Cookies"].splice(cookieIndex-1, 1);
      cookiesJSONParsed["Emails"].splice(cookieIndex-1, 1);
      fs.writeFileSync(cookieJSONLocate, JSON.stringify(cookiesJSONParsed), "utf8");
      UpdateCookies();
      console.log(getTimeStamp() + info + `${yellow}Datr(${cookieIndex})${white} Removed Successfully`);
      await Goback();
    }
    catch($){
      console.log(getTimeStamp() + error + $.message);
      process.exit();
    }
  }
}
async function FBLikers(){
  setClear();
  await animate(getTimeStamp() + info + `${yellow}NOTE: ${green}ENSURE THAT YOUR FACEBOOK POST IS SET TO PUBLIC`, 10);
  await animate(getTimeStamp() + info + `${yellow}NOTE: ${green}DON'T USE THE FACEBOOK APPLICATION TO COPY THE LINK OF THE POST, USE FACEBOOK LITE OR CHROME INSTEAD.`, 10);
  await Continue();
  setClear();
  await animate(banner);
  console.log();
  const { url } = await inquirer.prompt(prompts.getPostURL);
  if (url.toLowerCase() === "b"){
    await main();
    return;
  }
  let { react_type } = await inquirer.prompt(prompts.getReaction);
  if (cookiesJSONParsed["Cookies"].length === 0){
    console.log(getTimeStamp() + error + `No Cookies Found.`);
    console.log(getTimeStamp() + info + `Please add a cookie first so you can use FBLikers.`);
    await Continue();
    await CookieManagement();
    return;
  }
  await logInfo(url, react_type);
  let totalLikes = 0;
  let datrIndex = 1;
  if (react_type.includes("WOW")){
    react_type = react_type.slice(13, undefined)
  }
  else{
    react_type = react_type.slice(7, undefined);
  }
  for (let i = 0; i < cookiesJSONParsed["Cookies"].length; i++){
    try{
      console.log(getTimeStamp() + info + `${yellow}Using Cookie Datr#${datrIndex} ~ ${green}${cookiesJSONParsed["Cookies"][i].length >= 20 ? cookiesJSONParsed["Cookies"][i].slice(0, 20) : cookiesJSONParsed["Cookies"][i].slice(0, 10)}...`)
      console.log(getTimeStamp() + info + `${green}Starting...`);
      const config = {
        headers: {
        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 12; V2134 Build/SP1A.210812.003)',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
        'Cookie': cookiesJSONParsed["Cookies"][i]
        },
        httpAgent: httpAgent,
        httpsAgent: httpsAgent,
        timeout: 0
      };
      const postData = {
        post_id: url,
        react_type,
        version: 'v1.7'
      };
      const response = await axios.post(api, postData, config);
      const data = response.data;
      if (data.status === "FAILED"){
        if (data.message.includes("Invalid")){
          console.log(getTimeStamp() + error + `${yellow}Datr(${datrIndex}) ${red + "#" + data.status} | ${blue}@KairuDev`);
          console.log(getTimeStamp() + error + data.message.toUpperCase());
          console.log(getTimeStamp() + error + `PLEASE UPDATE YOUR COOKIE`);
        }
        else if (data.message.includes("wait")){
          console.log(getTimeStamp() + error + `${yellow}Datr(${datrIndex}) ${red + "#" + data.status} | ${blue}@KairuDev`);
          console.log(getTimeStamp() + error + data.message.concat(" | 20min").toUpperCase());
        }
        else{
          console.log(getTimeStamp() + error + `${yellow}Datr(${datrIndex}) ${red + "#" + data.status} | ${blue}@KairuDev`);
          console.log(getTimeStamp() + error + data.message.toUpperCase());
        }
      }
      else if (data.status === "SUCCESS"){
        const likesPattern = /\d+/g
        let likesCount = data.message.match(likesPattern)[0];
        likesCount = parseInt(likesCount);
        totalLikes += likesCount
        console.log(getTimeStamp() + info + `${yellow}Datr(${datrIndex}) ${green + "#" + data.status} | ${yellow}Received ${react_type} : ${green + likesCount} | ${blue}@KairuDev`);
      }
      else if (data.status === "INFO"){
        if (data.message.includes("outdated")){
          console.log(getTimeStamp() + error + `Something Went Wrong ${red}(Error #1; Outdated)`);
        }
        else if (data.message.includes("maintenance")){
          console.log(getTimeStamp() + error + `Something Went Wrong ${red}(Error #2; Maintenance)`);
        }
        else{
          console.log(getTimeStamp() + error + `Something Went Wrong ${red}(Error #3; Unknown)`);
        }
      }
      else{
        console.log(getTimeStamp() + error + `Something Went Wrong ${red}(Error #4; Unknown)`);
      }
      datrIndex++
    }
    catch($){
      console.log(getTimeStamp() + info + `${yellow}Datr(${datrIndex}) ${green}#SUCCESS | ${yellow}Received ${react_type} : ${green}UNKNOWN | ${blue}@KairuDev`);
      console.log(getTimeStamp() + error + "IGN " + $);
      datrIndex++
    }
  }
  if (!totalLikes){
    console.log(getTimeStamp() + info + `${yellow}Total Likes Count : ${green}UNKNOWN`);
  }
  else{
    console.log(getTimeStamp() + info + `${yellow}Total Likes Count : ${green + totalLikes}`)
  }
  await Goback();
}
async function logInfo(url, react_type){
  await animate(getTimeStamp() + info + `Target > ${green + url}`, 15);
  await animate(getTimeStamp() + info + `Selected Reaction > ${green + react_type}`, 15);
}
async function main(){
  setClear();
  await animate(banner);
  await animate(`
${yellow}(1) ~ ${blue}FBLikers ~ ${green}(LIKE, LOVE, HAHA, WOW, SAD, CARE, ANGRY)
${yellow}(2) ~ ${blue}ShowCookie ~ ${green}(Display Cookie Information)
${yellow}(3) ~ ${blue}CookieManagement ~ ${green}(AddCookie, DeleteCookie)
${yellow}(4) ~ ${blue}Feedback ~ ${green}(Chat With Developer)
${yellow}(5) ~ ${blue}Exit ~ ${green}(Exit The Program)
`)
  let { cmd } = await inquirer.prompt(prompts.getMainCommand);
  cmd = parseInt(cmd);
  if (cmd === 1){ //FBLikers 
    FBLikers();
  }
  else if (cmd === 2){ //ShowCookie
    ShowCookie();
  }
  else if (cmd === 3){ //CookieManagement
    CookieManagement();
  }
  else if (cmd === 4){ //FEEDBACK
    Feedback();
  }
  else if (cmd === 5){
    await exit();
  }
}
main();
process.on("SIGINT", () => {
  console.log("\n" + getTimeStamp() + info + `Keyboard Interrupt`);
  process.exit();
})

