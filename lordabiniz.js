const { Client, Intents,  } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES','GUILD_MEMBERS','GUILD_PRESENCES','GUILD_MESSAGE_REACTIONS','GUILD_EMOJIS','GUILD_BANS'] } ,disableMentions : "everyone"});
const open = require('./open.json');
const moment = require('moment');
const fs = require('fs');
const http = require('http')
const express = require('express')
const app = new express()
const data = require('./database/şema/Sunucu.js')
const dbl = require('dblapi.js')
require('events').EventEmitter.prototype._maxListeners = 100;
require('./loader/eventloader.js')(client)
app.get("/", (request, response) => {
  console.log(Date.now() + "7/24 AKTİF TUTMA İŞLEMİ BAŞARILI H.O");
  response.sendStatus(200);
});
app.listen('3000');



 client.login(open.token).then(a => {
  console.log('Bot Başlatılıyor...')}).catch(a => {
  return console.error('Token Yanlış.')
})
const commands = require('./loader/commandloader.js')
commands.run(client)
const dataLoader = require(`./loader/dataLoader.js`)
dataLoader.run(client)
const helper = require('./helpers/clientMethods.js')
helper.start(client,Discord)

//-----------------------------------------------------------------------------------
client.on('message', async message => {
     if(!message.author.id !== "573054368568311808") return; 
  if (message.content === '.katıl') { 
    client.emit('guildMemberAdd', message.member);
    message.channel.send('Katılış Eventi Tetiklendi.')
      }
     if(!message.author.id !== "573054368568311808") return; 
  if (message.content === '.ayrıl') { // 
    client.emit('guildMemberRemove', message.member);
   message.channel.send('Çıkış Eventi Tetiklendi.')
      }
  });


 

//BOT ATILINCA SUNUCU VERİLERİNİ SİLCEK
client.on('guildCreate',async (guild) => {
try {

  const emb = new Discord.MessageEmbed().setTitle('Eklendim')
  .addField('Sunucu ID',guild.id).addField('Sunucu Adı',guild.name).addField('Uye sayısı',guild.memberCount)
  .addField('Bot Sayısı',guild.members.cache.filter(a => a.user.bot).size)
  .addField('Rol sayısı',guild.roles.cache.size)
  .addField('Emoji Sayısı',guild.emojis.cache.size,true)
  .addField('Owner Ad',guild.owner.user.username).setColor('GREEN')
  client.guilds.cache.get('769112096683065344').channels.cache.get('769637900853444640').send(emb)
  
  } catch(e) {
  console.error(e)
  return;
}

  
})
client.on('guildDelete',async (guild) => {
   const emb = new Discord.MessageEmbed().setTitle('Atıldım')
  .addField('Sunucu ID',guild.id).addField('Sunucu Adı',guild.name).addField('Uye sayısı',guild.memberCount)
  .addField('Bot Sayısı',guild.members.cache.filter(a => a.user.bot).size)
  .addField('Rol sayısı',guild.roles.cache.size)
  .addField('Emoji Sayısı',guild.emojis.cache.size,true)
   .addField('Owner Ad',guild.owner.user.username).setColor('RED')
  client.guilds.cache.get('769112096683065344').channels.cache.get('769637900853444640').send(emb)
    if(guild){
await data.findOneAndDelete({sunucu : guild.id})
    }
})



client.on('guildMemberAdd',async member => {

let l = await data.findOne({sunucu  : member.guild.id})
if(!l)return;
try {
let yetkili = l.Yrol
let kayıtsız = l.Karol
let kayıtkanal = l.Kkanal
let otorol = l.otorol
let embed = l.embed
let mesaj = l.mesaj.msj,renk = l.mesaj.renk
if(yetkili && kayıtsız && kayıtkanal) {
let teyit1 = member.guild.roles.cache.get(yetkili)
let teyit2 = member.guild.channels.cache.get(kayıtkanal)
let teyit4 = member.guild.roles.cache.get(kayıtsız)
if(teyit1 && teyit2 && teyit4) {
  
let e;
  
var created = new Date().getTime() - member.user.createdAt.getTime();
var kuruluş = moment.duration(created).format("Y [yıl], D [gün], H [saat], m [dakika], s [saniye]")
var kuruluş2 = moment(member.user.createdAt).format("YYYY/MM/DD")

var ozeldurum = member.user.presence.activities[0] || 'Özel durumu yok'

var kelimeler = ["Canım Benim Hoşgeldin",'Ahh Uzak Diyarlardan geldin','Adamın dibisin sen ya','Gelmene Çok sevindim','Kimler Gelmiş Bakıyorum','hoppp Reiz Hoşgeldin']
var kelimelerc = kelimeler[Math.floor(Math.random() * 6)]

var milisaniye = '2592000000'//15 gün
if(created > milisaniye) e = `Güvenilir`
if(created < milisaniye) e = `Tehlikeli`

  const mapping = {
  " ": "   ",
  "0": "<a:sifir:769855664863969301>",
  "1": "<a:bir:769855664767500309>",
  "2": "<a:iki:769855665686315028>",
  "3": "<a:uc:769855665044455434>",
  "4": "<a:dort:769855664927146004>",
  "5": "<a:bes:769855664163127298>",
  "6": "<a:alti:769855662351974408>",
  "7": "<a:yedi:769855665434787851>",
  "8": "<a:sekiz:769855666293702656>",
  "9": "<a:dokuz:769855664944054294>", 
}
  let rplc =   `${member.guild.memberCount.toString()}`
     .split("")
     .map(c => mapping[c] || c)
     .join("")
  if(teyit2) {
    if(otorol) {
      member.roles.add(kayıtsız)
    }
    let msj;
    if(mesaj) msj = mesaj.
    replace('{user:etiket}',member).
    replace('{user:ad}',member.user.username).
    replace('{user:hastag}',member.user.discriminator).
    replace('{user:id}',member.id).
    replace('{user:kuruluş}',kuruluş2).
    replace('{user:kuruluş2}',kuruluş).
    replace('{user:tehlike}',e).
    replace('{user:durum}',ozeldurum.state || "Özel Durumu yok").
    replace('{guild:ad}',member.guild.name).
    replace('{guild:üye}',member.guild.memberCount).
    replace('{guild:üye2}',rplc).
    replace('{guild:yetkili:id}',teyit1.id).
    replace('{guild:yetkili:name}',teyit1.name).
    replace('{guild:yetkili:etiket}',teyit1).
    replace('{guild:kayıtsız:id}',teyit4.id).
    replace('{guild:kayıtsız:name}',teyit4.name).
    replace('{guild:kayıtsız:etiket}',teyit4).
    replace('{random}',kelimelerc)
    else msj = `

 <a:bibbop:769203010239725639> | ${member},**${kelimelerc}**

 <a:tac5:769163388738863104> | Seninle Beraber \`${member.guild.memberCount}\` Kişiyiz

 <a:altin2:769202957794672680> | Kayıt Olmak İçin İsim ve Yaşını Yazman yeterli!

 <a:morparti:769163390546345994> | **Kuruluş : \`${kuruluş}\`**

 <a:int_yok:769163390160732172> | __**Birazdan <@&${yetkili}> Rolündekiler Seni kayıt edecektir!**__

 <:user:773549662875287563> | **Bu kullanıcı ${e}!**

`
    if(embed) {
        const embed = new Discord.MessageEmbed().setAuthor(member.user.username).setThumbnail(member.user.avatarURL({dynamic : true, format : "png"}))
        .setDescription(msj).setColor(renk)
     await teyit2.send(`${teyit1}`).then(a => a.delete())
       teyit2.send(embed)     
    } else if(!embed) {
               teyit2.send(msj)       
      }  
    }
  
}
}
  
} catch(e) {
  console.error(e)
  
}
  let sayac = l.sayac
if(sayac.kanal && sayac.hedef) {
  let channel = member.guild.channels.cache.get(sayac.kanal)
  if(!channel)return;
  let hgmsj;
   let kalan = sayac.hedef - member.guild.memberCount
  if(sayac.hg) hgmsj = sayac.hg
    .replace('{guild:kalan}',kalan)
    .replace('{user:etiket}',member)
    .replace('{guild:üye}',member.guild.memberCount)
    .replace('{guild:hedef}',sayac.hedef)
    .replace('{guild:ad}',member.guild.name)
    .replace('{user:ad}',member.user.username)
    .replace('{user:tag}',member.user.tag)
  
  else hgmsj = `<:oki:769202569451929600>${member}, Sunucuya \`Geldi\` **${member.guild.memberCount}** Kişi Olduk **${sayac.hedef}** Kişi olmamıza **${kalan}** Kişi Kaldı!`
  if(member.guild.memberCount >= sayac.hedef) {
     channel.send(`<a:parti2:769163391943180319>${member}, Hedefe Ulaştık! **${sayac.hedef}** Kişi olduk, \`Sayaç Verileri Sıfırlandı\` Yeniden Ayarlayınız.`)
    await data.findOneAndUpdate({sunucu : member.guild.id},{$set : {"sayac.embed":false,"sayac.hedef":null,"sayac.kanal":null,"sayac.hg":null,"sayac.bb":null}})
   
  }
  
  if(sayac.embed == true) {
    channel.send(new Discord.MessageEmbed().setDescription(hgmsj).setColor('#00ff11'))
  } else {
    channel.send(hgmsj)
  }
  
}
          })
client.on('guildMemberRemove',async member => {
  
let l = await data.findOne({sunucu  : member.guild.id})
if(!l)return;
  
    let sayac = l.sayac
if(sayac.kanal && sayac.hedef) {
  let channel = member.guild.channels.cache.get(sayac.kanal)
  if(!channel)return;
  let kalan = sayac.hedef - member.guild.memberCount
  let hgmsj;
  if(sayac.bb) hgmsj = sayac.bb
    .replace('{guild:kalan}',kalan)
    .replace('{guild:üye}',member.guild.memberCount)
    .replace('{guild:hedef}',sayac.hedef)
    .replace('{guild:ad}',member.guild.name)
    .replace('{user:ad}',member.user.username)
    .replace('{user:tag}',member.user.tag)

  else hgmsj = `<:noki:769202569410117653>${member}, Sunucudan \`Ayrıldı\` **${member.guild.memberCount}** Kişi Kaldık **${sayac.hedef}** Kişi olmamıza **${kalan}** Kişi Kaldı!`

  
  if(sayac.embed == true) {
    channel.send(new Discord.MessageEmbed().setDescription(hgmsj).setColor('#ff0000'))
  } else {
    channel.send(hgmsj)
  }
}
})





