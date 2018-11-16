import Api from "@/services/Api";

export default {
  randomKanjis() {
    return Api().get("kanjis/randomKanjis", {
      params: {}
    });
  }
};
