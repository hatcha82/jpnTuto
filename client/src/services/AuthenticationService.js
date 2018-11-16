import Api from "@/services/Api";

export default {
  register(credentials) {
    return Api().post("register", credentials);
  },
  login(credentials) {
    return Api().post("login", credentials);
  },
  logout(credentials) {
    return Api().post("logout", credentials);
  },
  oAuthLogin(credentials) {
    return Api().post("oAuthLogin", credentials);
  }
};
