export function setAuthCookie(res, token) {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const prod = process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: ONE_DAY,           // 15 min – tweak to taste
        sameSite: prod ? "None" : "Lax",  // Lax for localhost, None for HTTPS prod
        secure: prod,
    });
}