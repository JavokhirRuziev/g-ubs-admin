import { useEffect, useState } from "react";

export default function useMediaQueries() {
	const [mobile, setMobile] = useState(window.innerWidth < 768);
	const windowWidth = window.innerWidth;

	useEffect(() => {
		function handleResize() {
			setMobile(window.innerWidth < 768);
		}
		window.addEventListener("resize", handleResize);
		window.addEventListener("load", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			window.addEventListener("load", handleResize);
		};
	}, [windowWidth]);

	return { mobile };
}
