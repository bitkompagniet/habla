const _ = require('lodash');
const NodeTrello = require('node-trello'); // nodeTrello is a wrapper for the trello api library.

function fetchTrello(tokens, method, url) {
	const token = tokens.trello.token;
	const key = tokens.trello.key;
	const trello = new NodeTrello(key, token);
	return new Promise((resolve, reject) => {
		trello[method](url, (err, payload) => {
			if (err) reject(err);
			resolve(payload);
		});
	});
}




module.exports = {
	allRepos: {
		me: async function(tokens) {
            const cards = await fetchTrello(tokens, 'get', '/1/members/me/cards');
            const boardPromises = _.map(cards, (card) =>
                fetchTrello(tokens, 'get', `/1/boards/${card.idBoard}`).then((board) => {
                    card.boardName = board.name;
                }).catch(err => console.log(err))
            );
            const listPromises = _.map(cards, (card) =>
                fetchTrello(tokens, 'get', `/1/lists/${card.idList}`).then((list) => {
                    card.milestone = list.name;
                }).catch(err => console.log(err))
            );

            return Promise.all(boardPromises, listPromises).then(() => cards).catch(err => console.log(err));
		},

        unassigned: async function(tokens) {
        
        },
    },


    thisRepo: {
        me: async function(tokens) {

        },
        
        unassigned: async function(tokens) {
        
        },
    },
};