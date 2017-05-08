const _ = require('lodash');
const NodeTrello = require('node-trello'); // nodeTrello is a wrapper for the trello api library.
const projectUrls = require('../../../project-urls');

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

function getThisRepo() {
	return projectUrls.baseUrl().then(url => {
		urlSplit = url.split('/')
		return urlSplit[urlSplit.length-1];
	});
}

module.exports = {
	allRepos: {
		me: async function(tokens) {
			const me = await fetchTrello(tokens, 'get', '/members/me/')
			const myId = me.id; 
			let cards = await fetchTrello(tokens, 'get', '/1/members/me/cards');
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
			cards = _.filter(cards, (card) => _.findIndex(card.idMembers, myId) + 1); // adding 1 to disable '0' from being falsy.
			return Promise.all(boardPromises, listPromises).then(() => cards).catch(err => console.log(err));
		},

		unassigned: async function(tokens) {
			const myBoards = await fetchTrello(tokens, 'get', '1/members/me/boards');
			const boardsIds = _.map(myBoards, (board, i) => board.id)
			const cardsToBeFetched = _.map(boardsIds, (id, i) => {
				return fetchTrello(tokens, 'get', `1/boards/${id}/cards`).then(cards =>{
					return _.map(cards, (card) => {
						card.boardName = myBoards[i].name;
						return card;
					})
				})
			});
			const cardsForEachProject = await Promise.all(cardsToBeFetched);
			mergedCards = [].concat.apply([], cardsForEachProject);
			return mergedCards;
		},
	},


	thisRepo: {
		me: async function(tokens) {
			const me = await fetchTrello(tokens, 'get', '/members/me/')
			const myId = me.id; 
			const thisProject = await getThisRepo();
			const boardSearch = await fetchTrello(tokens, 'get', `1/search/?query=${thisProject}&modelTypes=boards`);
			if(!boardSearch.boards ||!boardSearch.boards.length) return null;
			let cards = await fetchTrello(tokens, 'get', `1/boards/${boardSearch.boards[0].id}/cards`);
			cards = _.filter(cards, (card) => _.findIndex(card.idMembers, myId) + 1); // adding 1 to disable '0' from being falsy.
			cards = _.map(cards, card => {
				card.boardName = thisProject;
				return card;
			});
			return cards;
		},
		
		unassigned: async function(tokens) {
			const thisProject = await getThisRepo();
			const boardSearch = await fetchTrello(tokens, 'get', `1/search/?query=${thisProject}&modelTypes=boards`);
			if(!boardSearch.boards ||!boardSearch.boards.length) return null;
			let cards = await fetchTrello(tokens, 'get', `1/boards/${boardSearch.boards[0].id}/cards`);
			cards = _.filter(cards, (card) => (card.idMembers.length == 0));
			cards = _.map(cards, card => {
				card.boardName = thisProject;
				return card;
			});
			return cards;
		},
	},
};