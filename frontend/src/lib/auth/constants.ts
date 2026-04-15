export const AUTH_COOKIE_NAME = "heritage_token";
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

export function getSessionCookieOptions() {
	const isProduction = process.env.NODE_ENV === "production";
	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax" as const,
		path: "/",
		maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
	};
}

export function getExpiredSessionCookieOptions() {
	const isProduction = process.env.NODE_ENV === "production";
	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax" as const,
		path: "/",
		maxAge: 0,
	};
}
