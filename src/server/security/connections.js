
module.exports = app => {
    return {
        players: [],

        sockets: null,
        playing: 0,

        onHandshake: function (socket) {
            if (this.players.some(f => f.socket.id === socket.id))
                return;

            const p = {};
            p.socket = socket;
            
            this.players.push(p);
        },
        onDisconnect: async function (socket) {
            let player = this.players.find(p => p.socket.id === socket.id);
    
            if (!player)
                return;
    
            this.players.spliceWhere(p => p.socket.id === socket.id);
        },
    }
}