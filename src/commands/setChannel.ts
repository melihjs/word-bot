import Command from '../Command';

class SetChannel extends Command {
    constructor(client) {
        super(client, {
            name: 'setChannel'
        });
    }

    async run(message, args) {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('Gerekli yetkin yok!');
        } else {
            var channel = message.mentions.channels.first();
            if (!channel) {
                return message.reply('Lütfen bir kanal etiketle!');
            } else {
                this.db.set(`kanal_${message.guild.id}`, channel.id);
                return message.reply('Kanal başarıyla ayarlandı!');
            }
        }
    }
}

export = SetChannel;