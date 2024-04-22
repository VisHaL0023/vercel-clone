export function getSession() {
    // Get all cookies as a string
    const cookiesString = document.cookie;

    // Parse the cookies string into an object
    const cookiesArray = cookiesString?.split(";");

    const cookies: { [Key: string]: string } = {};
    cookiesArray?.forEach((cookie) => {
        const [name, value] = cookie?.trim()?.split("=");
        cookies[name] = value;
    });

    return cookies?.__session;
}

export function removeSession() {
    document.cookie = "";
}
