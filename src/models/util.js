import { nanoid } from 'nanoid';

export function uuid() {
	return nanoid();
}

export function store(namespace, data) {
	if (data) return localStorage[namespace] = JSON.stringify(data);

	let store = localStorage[namespace];
	return store && JSON.parse(store) || [];
}