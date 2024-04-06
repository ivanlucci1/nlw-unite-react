import { NavLink } from './nav-link';

import nlwUniteIcon from '../assets/nlw-unite-icon.svg';

export function Header() {
	return (
		<div className="flex items-center gap-5 py-2">
			<img src={nlwUniteIcon} alt="NLW Unite" />

			<nav className="flex items-center gap-5">
				<NavLink href="/events">Events</NavLink>
				<NavLink href="/participants">Participants</NavLink>
			</nav>
		</div>
	);
}
