import s from './not-found.module.scss';

export default function NotFound() {
	return (
		<div className={s.container}>
			<h1>404 - Not Found</h1>
			<p>Could not find requested resource</p>
			<a href='/'>Return Home</a>
		</div>
	);
}
