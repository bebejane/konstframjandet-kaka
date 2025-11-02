import s from './not-found.module.scss';

export default function NotFound() {
	return (
		<div className={s.container}>
			<h2>404 - Not Found</h2>
			<p>Could not find requested resource</p>
			<a href='/'>Return Home</a>
		</div>
	);
}
