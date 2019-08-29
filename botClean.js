const Discord = require('discord.js')
require('dotenv').config();
const osu = require('node-osu')
const client = new Discord.Client()
var admin = ["537091937271021580", "289210805763964929"];
var mainServer = client.guilds.get("545413042712739840");

var osuKey = process.env.osuApi;
//Initialization
client.on('ready', () => {

    var rand;
    console.log("Connected as " + client.user.tag)

// List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(` - ${guild.name} (${guild.id})`);
    })
})

// Token login
client.login(`${process.env.TOKEN}`);

//Input from cmd line
var standard_input = process.stdin;

// Set input character encoding.
standard_input.setEncoding('utf-8');

// Prompt user to input data in console.
console.log("Please input text in command line.");

// When user input data and click enter key.
standard_input.on('data', function (data) {

    if(data.startsWith('announce ')){
        //Truncate announce command
        data = data.substring(data.indexOf(' ') + 1);
        var announceChan = client.channels.get("545413042712739842");
        sendMsg(announcement, announceChan);
    }

    if(data.startsWith('ls ')){
        //Truncate ls command
        var beginArg = data.indexOf(' ') + 1;
        var requestedID = data.substring(beginArg, beginArg + 18);
        var requestedGuild = client.guilds.get(requestedID);
        data = data.substring(beginArg + 19);
        if(data.startsWith("chan")){
            console.log(`Channels in ${requestedGuild.name}:`);
            requestedGuild.channels.forEach((channel) => {
                console.log(`- ${channel.name} (${channel.type} // ${channel.id})`);
            });
        }else if (data.startsWith("user")){
            console.log(`Users in ${requestedGuild.name}:`);
            requestedGuild.members.forEach((member) => {
                console.log(`- ${member.displayName} (${member.id})`);
            })
        }
    }
});

//Received Message
client.on('message', (receivedMessage) => {
    //Escape bot messages
    if (receivedMessage.author == client.user) {
       return
    }

    //Log received DM
    if(receivedMessage.guild == null){
        console.log(`Message from ${receivedMessage.author.username}`);

        //Forward DMs not from admin to Jace
        if(admin.indexOf(receivedMessage.author.id) == -1){
            var jace = client.users.get("537091937271021580");
            jace.send(`Received DM from ${receivedMessage.author.username} (ID: ${receivedMessage.author.id}):\n${receivedMessage.content}`)
                .then(console.log("DM forwarded"))
                .catch(console.error);
        }
    }

    if(admin.indexOf(receivedMessage.author.id) > -1){
        adminCommands(receivedMessage);
    }
    prefixCommands(receivedMessage);
    implicitCommands(receivedMessage);
})

/*
 *  ~~~~Msg processing functions~~~~
 */
function prefixCommands(msg){
    if(msg.content.startsWith("/test")){
        sendMsg("test", msg.channel);
    }

    if(!msg.content.startsWith("/")){
        return;
    }
    var txtLower = msg.content.substring(1).toLowerCase();
    var txt = msg.content.substring(1);
    var chan = msg.channel;

    //Sends command help embed
    if(txtLower === "help"){
      const helpMsg = new Discord.RichEmbed()
          .setTitle("YangBot commands")
          .setAuthor("YangBot", "https://cdn.discordapp.com/attachments/344959018676256772/490381512772943873/eternal_suffering_john.jpg")
          .setColor(0xED25E9)
          .setFooter("If you need any other help with commands and functionality, go fuck yourself.")
          .setThumbnail("")   //FIXME: add thumbnail
          .setTimestamp(msg.createdAt)
          .setURL("https://cdn.discordapp.com/attachments/545410384132309006/566086056764637195/jawn.jpg")
          .addField("Auto", "`uwu`, `nigger`, `what's fascism`, `no u`, `rhodesia`, `death to Israel`")  //FIXME: keep updated !!!
          .addField("Prefixed", "Preface these commands with a `/`\n`headpat [num]`, `roll`, `uwuify [msg]`, `stroke [msg]`")
          sendMsg(helpMsg, chan);
    }

    //Server info
    if(txtLower === "info"){
        var servReq = msg.guild;
        const infoMsg = new Discord.RichEmbed()
          .setTitle(`Info about ${servReq.name}`)
          .setAuthor("YangBot", "https://cdn.discordapp.com/attachments/344959018676256772/490381512772943873/eternal_suffering_john.jpg")
          .setColor(0xED25E9)
          .setFooter("If you need any other help with commands and functionality, go fuck yourself.")
          .setThumbnail(`${servReq.iconURL}`)   //FIXME: add thumbnail
          .setTimestamp(msg.createdAt)
          .setURL("https://cdn.discordapp.com/attachments/545410384132309006/566086056764637195/jawn.jpg")
          .addField("Owner", `${servReq.owner.user.username}`)
          .addField("Members", `${servReq.memberCount}`)
          .addField("Date Created", `${servReq.createdAt.toDateString()}`)
          .addField("Region", `${servReq.region}`)
          sendMsg(infoMsg, chan);
    }

    //Sends X headpats in dms
    if(txtLower.startsWith("headpat")){
        var numHeadpats = parseInt(txtLower.substring(txtLower.indexOf(" ") + 1));
        if(numHeadpats > 25){
            sendMsg("Too many headpats!!!!11!1!", chan);
        }else{
            for(var i = 0; i < numHeadpats; i++){
              msg.author.send({
                  files: ['https://cdn.discordapp.com/attachments/545410384132309006/582461473654046721/unknown.png']
                  })
                  .then(console.log(`Sent headpat to ${msg.author.username}`))
                  .catch(console.error);
            }
        }
      }

    //Rolls random num, 4chan-style
    if(txtLower === "roll"){
        var randNum = Math.floor(Math.random() * 99999999) + 1;
        sendMsg(randNum, chan);
    }

    //Replaces u's and o's with uwus and owos
    if(txtLower.startsWith("uwuify")){
      var uwuMsg = "";
      var originalString = txt.substring(txt.indexOf(' ') + 1);
      for(var iuwu = 0; iuwu < originalString.length; iuwu++){
        var testChar = originalString.charAt(iuwu);
        if(testChar === 'u'){
          uwuMsg += "uwu";
        }else if (testChar === 'o') {
          uwuMsg += "owo";
        }else if (testChar === 'U') {
          uwuMsg += "UWU";
        }else if (testChar === 'O') {
          uwuMsg += "OWO";
        }else{
          uwuMsg += testChar;
        }
      }
      sendMsg(uwuMsg, chan);
    }

    //Removes instances of uwu and owo
    if(txtLower.startsWith("unuwuify")){
        var noUwu = "";
        txt = txt.substring(txt.indexOf(" "));
        for(var deuwui = 0; deuwui < txt.length; deuwui++){
            noUwu += txt.charAt(deuwui);

            if(txt.charAt(deuwui) === 'u' || txt.charAt(deuwui) === 'U'){
                while(deuwui + 2 < txt.length && txt.substring(deuwui + 1, deuwui + 3) === "wu"){
                    deuwui += 2;
                }
            }else if(txt.charAt(deuwui) === 'o' || txt.charAt(deuwui) === 'O'){
                while(deuwui + 2 < txt.length && txt.substring(deuwui + 1, deuwui + 3) === "wo"){
                    deuwui += 2;
                }
            }
        }

        sendMsg(noUwu, chan);
    }

    //Scrambles String
    if(txtLower.startsWith("stroke")){
      var dysMsg = txt.substring(txt.indexOf(' ') + 1);

      var scalars = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      var autismAmt = 0.3;
      if(scalars.indexOf((dysMsg.charAt(0))) > (-1)){
        autismAmt = parseInt(dysMsg.charAt(0)) / 10;
        dysMsg = dysMsg.substring(2);
        console.log("Scrambling with Autism scalar: " + autismAmt);
      }

      for(var i = 0; i < dysMsg.length; i++){
        if(Math.random() < autismAmt && dysMsg.charAt(i) != ' '){
          dysMsg = swapChar(i, dysMsg);
        }
      }
      sendMsg(dysMsg, chan);
    }


}

function adminCommands(msg){

    //DM user ID
    if(msg.content.startsWith("/dm")){
        var dmMsg = msg.content.substring(msg.content.indexOf(" ") + 1);
        var dmArg1 = dmMsg.substring(0, dmMsg.indexOf(" "));
        var dmArg2 = dmMsg.substring(dmMsg.indexOf(" ") + 1);

        var recipient = client.users.get(dmArg1);
        sendMsg(dmArg2, recipient);
    }

    if(msg.content.startsWith("/announce")){
      var announcement = msg.content.substring(msg.content.indexOf(' ') +1);
      sendMsg(announcement, client.channels.get("545413042712739842"));
    }
}

function implicitCommands(msg){
    var txtLower = msg.content.toLowerCase();
    var txt = msg.content;
    var chan = msg.channel;

    //No U
    if(txtLower === "no u"){
        sendMsg("no u", chan);
    }

    //Boop Beep
    if(txtLower === "boop"){
        sendMsg("beep", chan);
    }

    //Send squillion value
    if(txtLower.includes("squillion")){
        sendMsg("259232147948794494594485446818048254863271026096382337884099237269509380022108148908589797968903058274437782549758243999867043174477180579595714249308002763427793979644775390625000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", chan);
    }

    //Eternal Suffering John
    if(txtLower.includes("cursed")){
      chan.send({
          files: ['https://cdn.discordapp.com/attachments/545410384132309006/570396383765463060/jawn.jpg']
      })
      .then(console.log("Sent eternal suffering john"))
      .catch(console.error);
    }

    ///Death to Israel
    if(txtLower === "death to israel"){
        sendMsg("When you read the Quran, seek refuge with Allah from Satan the outcast. He has no authority over those who believe and trust in their Lord. His authority is only over those who follow him, and those who associate others with Him.", chan);
    }

    //What's fascism
    if(txtLower.includes("what's fascism") || txtLower.includes("what is fascism")){
        sendMsg("Fascism follows the truth, and uses nature "
      + "as its guide to do so, as nature is a manifestation of what is true."
      + " Fascism is an ancient ideology that predates man, for it is simply "
      + "the law of nature and it has existed since life first erupted on Earth."
      + " There can be one truth, but there can be infinite lies. Fascism is "
      + "that one truth, and all other contemporary systems are lies and "
      + "falsehoods that bear various degrees of accuracy to the truth. Fascism"
      + " is hated because it is the truth, and liars fear what is true, and "
      + "it is human nature to hate that which we fear.", chan);
    }

    //uwu
    if(txtLower === "uwu"){
        sendMsg("owo", chan);
    }

    //owo
    if(txtLower === "owo"){
        sendMsg("What's this?", chan);
    }

    //Rhodesia
    if(txtLower.includes("rhodesia")){

      rand = Math.floor(Math.random() * 10);
      if (rand == 0) {
        sendMsg("Rhodesians never die!", chan)
      }
      else if (rand == 1) {
        sendMsg("Ian Smith and Cecil Rhodes are my heroes!", chan);
      }
      else if (rand == 2) {
        sendMsg("Here's the story of Rhodesia, a land both fair and great. On 11th of November an independent state. This was much against the wishes of certain governments. Whose leaders tried to break us down, to make us all repent."
        + " \'Cause we\'re all Rhodesians and we\'ll fight through thick and thin. We\'ll keep our land a free land, stop the enemy coming in. We\'ll keep them north of the Zambezi till that river\'s running dry. This mighty land will prosper for Rhodesians never die."
        + " They can send their men to murder and they can shout their words of hate. But the cost of keeping this land free will never be too great. For our men and boys are fighting for the things that they hold dear. This land and all its people will never disappear."
        + " \'Cause we\'re all Rhodesians and we\'ll fight through thick and thin. We'll keep our land a free land, stop the enemy coming in. We\'ll keep them north of the Zambezi till that river\'s running dry. This mighty land will prosper for Rhodesians never die."
        + " We\'ll preserve this little nation, for our children\'s children too. For once you\'re a Rhodesian, no other land will do We will stand forth in the sunshine, with the truth upon our side. And if we have to go alone, we\'ll go alone with pride."
        + " Cause\' we\'re all Rhodesians and we\'ll fight through thick and thin. We\'ll keep our land a free land, stop the enemy coming in. We\'ll keep them north of the Zambezi till that river\'s running dry. This mighty land will prosper for Rhodesians never die.", chan);
        }
       else if (rand == 3) {
          sendMsg("FAL best gun dont @ me", chan);
       }
       else if (rand == 4) {
          sendMsg("RLI best army dont @ me", chan);
       }
       else if (rand == 5) {
          sendMsg("1 maxim machine gun > 2500 ooga boogas", chan);
       }
       else if (rand == 6) {
          sendMsg("Operation Dingo 1:1500 KDR, RLI best military", chan);
       }
       else if (rand == 7) {
          sendMsg("Short shorts best military attire", chan);
       }
       else if (rand == 8) {
          sendMsg("Never forget the Shangani Patrol", chan);
       }
       else if (rand == 9) {
          sendMsg("Operation Eland 4000 killed NO LOSSES", chan);
       }
    }

    //Dad Joke
    if(txtLower.startsWith("i'm ") || txtLower.startsWith("im ")){
        var dadJoke = `Hi ${txt.substring(txt.indexOf(" ") + 1)}, I'm Andrew Yang!`;
        sendMsg(dadJoke, chan);
    }

    if(txtLower === "bruh"){
        sendImg('https://cdn.discordapp.com/attachments/545410384132309006/589655239020511234/dXKx9agF_400x400.png',  chan);
    }

    if(txtLower === "vc tiem"){
        var voiceChan = client.channels.get("545439566006583306");
        voiceChan.join();
    }
}


/*
 *  ~~~~Misc functions~~~~
 */

//Sends msg to chan, logs and catches errs
function sendMsg(msg, chan){
    try{
       chan.send(msg)
           .then(message => console.log(`Message sent: ${message.content}`));
    }
    catch(error){
         console.error(error);
    }
}

function sendImg(url, chan){
    try{
      chan.send({
        files: [url]
      })
      .then(console.log("Image sent"))
    }
    catch(error){
        console.error(error);
    }
}

//Swaps char at given index with following
function swapChar(index, string){
    var swapRes = "";
    if(index < (string.length - 1)){
      swapRes = string.substring(0, index) + string.charAt(index + 1) + string.charAt(index);
      if(index < (string.length - 2)){
        swapRes += string.substring(index + 2);
      }
    }else{
      swapRes = string;
    }
    return swapRes;
  }
