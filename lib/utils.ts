import { format } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';
import React from 'react';

export const isServer = typeof window === 'undefined';

export const chunkArray = (array: any[] | React.ReactNode[], chunkSize: number) => {
	const newArr = [];
	for (let i = 0; i < array.length; i += chunkSize) newArr.push(array.slice(i, i + chunkSize));
	return newArr;
};

export const formatDate = (date: string, endDate?: string) => {
	if (!date) return '';
	const s = capitalize(format(new Date(date), 'dd MMM')).replace('.', '');
	const e = endDate ? capitalize(format(new Date(endDate), 'dd MMM')).replace('.', '') : undefined;
	return `${s}${e ? ` – ${e}` : ''}`;
};

export const randomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export type TruncateOptions = {
	sentences: number;
	useEllipsis: boolean;
	minLength: number;
};

export const truncateWords = (text: string, minLength: number): string => {
	if (text.length <= minLength) {
		return text;
	}
	var truncatedText = text.substr(0, minLength);
	var lastSpaceIndex = truncatedText.lastIndexOf(' ');
	if (lastSpaceIndex !== -1) {
		truncatedText = truncatedText.substr(0, lastSpaceIndex);
	}
	return truncatedText + '...';
};
