// use this to decode a token and get the user's information out of it
import decode from "jwt-decode";

// this will create a new class to instantiate for a user
class AuthService {
    // this is going to get the user data
    getProfile() {
        return decode(this.getToken());
    }

    // this will check if the user is logged in
    loggedIn() {
        // this check if there is a saved token and if its still valid
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    // this will check if the token is expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }

    getToken() {
        // this retrieves the user token from localStorage
        return localStorage.getItem("id_token");
    }

    login(idToken) {
        // this will save the user token to localStorage
        localStorage.setItem("id_token", idToken);
        window.location.assign("/");
    }

    logout() {
        // this will clear the user token and profile data from the localStorage
        localStorage.removeItem("id_token");
        // this will reload the page and reset the state of the application
        window.location.assign("/");
    }
}

export default new AuthService();
