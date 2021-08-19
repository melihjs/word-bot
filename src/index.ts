import WordClient from './Client';
import fs from 'fs';
import fetch from 'node-fetch';
const client = new WordClient();
const db = require('quick.db');
const log = msg => console.log(msg);

client.on('ready', async () => {
    log('WordBot hazır!');
});

client.on('message', async (message) => {
    var prefix = "prefix";
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    var command = args.shift();
    var cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(message, args);
});

fs.readdir('./dist/commands/', async (err, files) => {
    if (err) throw new Error(err.message);
    files.forEach(async (dosya) => {
        var file = new (require(`./commands/${dosya}`))(client);
        client.commands.set(file.name, file);
    });
});

client.on('message', async (message) => {
    var kaanal = db.fetch(`kanal_${message.guild.id}`);
    if (message.author.bot) return;
    if (message.channel.id !== kaanal) return;
    if (message.content.startsWith('.')) return;
    if (message.content.split(" ").length > 1) return message.channel.send('kelime ya bruh').then(msg => {
        msg.delete({
            timeout: 5000
        });
        message.delete();
    });
    let kelime = db.get(`son_${message.guild.id}`);
    let kelimeler = db.get(`kelimeler_${message.guild.id}`);
    let kişi = db.get(`klm_${message.guild.id}`);
    if (kişi == message.author.id) return message.channel.send('en son zaten sen yazmışsın -_-').then(msg => {
        msg.delete({
            timeout: 5000
        })
        message.delete()
    });
    if (kelime == null) {
        let random = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        let son = random.charAt(random.length - 1);
        db.set(`son_${message.guild.id}`, son);
        message.channel.send('Oyun **' + son + '** harfi ile başladı');
    };
    if (kelime !== message.content.charAt(0)) return message.channel.send('en son yazılan kelime **' + kelime + '** ile bitmiş üzgünüm :(').then(msg => {
        msg.delete({
            timeout: 5000
        });
        message.delete();
    });
    if (!kelimeler) return db.push(`kelimeler_${message.guild.id}`, message.content);
    if (kelimeler.includes(message.content)) return message.channel.send('Bu kelime zaten yazılmış başka bir şey dene :/').then(msg => {
        msg.delete({
            timeout: 5000
        });
        message.delete();
    });
    const api = await fetch(`https://sozluk.gov.tr/gts?ara=${encodeURI(message.content)}`).then(response => response.json());
    if (api.error) return message.channel.send('Yazdığın kelimeyi tdk da bulamadım :(').then(msg => {
        msg.delete({
            timeout: 5000
        });
        message.delete();
        db.subtract(`puan_${message.guild.id}_${message.author.id}`, 1);
    });
    if (message.content.charAt(message.content.length - 1) === 'ğ'.toLowerCase()) return message.channel.send('sonu ğ ile bitmemeli.').then(msg => {
        msg.delete({
            timeout: 5000
        });
        message.delete();
    });
    db.push(`kelimeler_${message.guild.id}`, message.content);
    db.set(`son_${message.guild.id}`, message.content.charAt(message.content.length - 1));
    db.set(`klm_${message.guild.id}`, message.author.id);
    db.add(`puan_${message.guild.id}_${message.author.id}`, 2);
    message.react('🥲');
});

client.start('token');